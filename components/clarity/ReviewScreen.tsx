"use client";

import { useMemo, useState } from "react";
import { COPY, type ClarityLang } from "@/lib/clarity/copy";
import type {
  ClaimDecision,
  ClaimSource,
  ExtractedClaim,
  ReviewState,
  ScanResult,
  TopicId,
  TopicReview,
} from "@/lib/clarity/types";
import { claimsConflict } from "@/lib/clarity/extract";
import { reviewClaims, splitReview } from "@/lib/clarity/focus";
import { friendlyPageLabel, textFragmentUrl } from "@/lib/clarity/source";
import MaterialIcon from "./MaterialIcon";

type ConfirmAction = {
  kind: "approve" | "reject";
  topicId: TopicId;
  claim: ExtractedClaim;
  against: ExtractedClaim[];
};

export default function ReviewScreen({
  lang,
  result,
  state,
  onDecision,
  onCanonical,
  onMarkRestRejected,
  onNotRelevant,
  onOpenKnowledge,
}: {
  lang: ClarityLang;
  result: ScanResult;
  state: ReviewState;
  onDecision: (topicId: TopicId, claimId: string, decision: ClaimDecision) => void;
  onCanonical: (topicId: TopicId, text: string) => void;
  onMarkRestRejected: (topicId: TopicId, keepClaimId: string) => void;
  onNotRelevant: (topicId: TopicId) => void;
  onOpenKnowledge: () => void;
}) {
  const t = COPY[lang];
  const he = lang === "he";
  const [openSource, setOpenSource] = useState<{ claim: ExtractedClaim; source: ClaimSource } | null>(
    null,
  );
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);
  const [missingOpen, setMissingOpen] = useState(false);

  const { conflicts, confirm: found, missing } = useMemo(() => splitReview(result), [result]);

  function approvedIn(topic: TopicReview) {
    const topicState = state.decisions[topic.id];
    if (!topicState) return [];
    return topic.claims.filter((claim) => topicState.claimDecisions[claim.id] === "approved");
  }

  function conflictingApproved(topic: TopicReview, claim: ExtractedClaim) {
    const approved = approvedIn(topic);
    const direct = approved.filter((item) => claimsConflict(item, claim));
    if (direct.length > 0) return direct;
    if (topic.status === "conflict") return approved.filter((item) => item.id !== claim.id);
    return [];
  }

  function markTrue(topic: TopicReview, claim: ExtractedClaim) {
    const topicState = state.decisions[topic.id];
    if (!topicState) return;
    if (topicState.claimDecisions[claim.id] === "approved") {
      onDecision(topic.id, claim.id, "pending");
      return;
    }
    const against = conflictingApproved(topic, claim);
    if (against.length > 0) {
      setConfirm({ kind: "approve", topicId: topic.id, claim, against });
      return;
    }
    onDecision(topic.id, claim.id, "approved");
  }

  function markFalse(topic: TopicReview, claim: ExtractedClaim) {
    const topicState = state.decisions[topic.id];
    if (!topicState) return;
    if (topicState.claimDecisions[claim.id] === "rejected") {
      onDecision(topic.id, claim.id, "pending");
      return;
    }
    const against = conflictingApproved(topic, claim);
    if (against.length > 0) {
      setConfirm({ kind: "reject", topicId: topic.id, claim, against });
      return;
    }
    onDecision(topic.id, claim.id, "rejected");
  }

  function applyConfirm() {
    if (!confirm) return;
    if (confirm.kind === "approve") onMarkRestRejected(confirm.topicId, confirm.claim.id);
    else onDecision(confirm.topicId, confirm.claim.id, "rejected");
    setConfirm(null);
  }

  return (
    <main className="mx-auto max-w-2xl px-5 pb-32 pt-8 sm:px-8 sm:pt-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-assis-blue/80">
        {t.doThisNow}
      </p>
      <h1 className="font-display mt-2 text-[1.65rem] font-semibold tracking-[-0.04em] text-foreground sm:text-[1.85rem]">
        {t.reviewTitle}
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t.doThisSteps}</p>
      <p className="mt-1 text-[12px] text-zinc-400" dir="ltr">
        {result.storeName}
      </p>

      {conflicts.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">
            {t.sectionConflicts}
          </h2>
          <div className="mt-4 space-y-8">
            {conflicts.map((topic) => (
              <TopicBlock
                key={topic.id}
                lang={lang}
                topic={topic}
                state={state}
                onTrue={(claim) => markTrue(topic, claim)}
                onFalse={(claim) => markFalse(topic, claim)}
                onOpenSource={setOpenSource}
              />
            ))}
          </div>
        </section>
      ) : null}

      {found.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">
            {t.sectionFound}
          </h2>
          <p className="mt-1 text-[13px] text-muted-foreground">{t.reviewBody}</p>
          <div className="mt-4 space-y-8">
            {found.map((topic) => (
              <TopicBlock
                key={topic.id}
                lang={lang}
                topic={topic}
                state={state}
                onTrue={(claim) => markTrue(topic, claim)}
                onFalse={(claim) => markFalse(topic, claim)}
                onOpenSource={setOpenSource}
              />
            ))}
          </div>
        </section>
      ) : null}

      {missing.length > 0 ? (
        <section className="mt-10">
          <button
            type="button"
            onClick={() => setMissingOpen((open) => !open)}
            className="flex w-full items-center justify-between text-start"
          >
            <h2 className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">
              {t.sectionMissing}
              <span className="ms-2 text-[13px] font-medium text-zinc-400">{missing.length}</span>
            </h2>
            <MaterialIcon name={missingOpen ? "expand_less" : "expand_more"} className="text-zinc-400" />
          </button>
          <p className="mt-1 text-[13px] text-muted-foreground">{t.sectionMissingHint}</p>
          {missingOpen ? (
            <div className="mt-4 space-y-4">
              {missing.map((topic) => {
                const topicState = state.decisions[topic.id];
                if (topicState?.notRelevant) return null;
                return (
                  <div key={topic.id} className="rounded-[1.35rem] border border-dashed border-black/[0.08] bg-white/60 p-4 sm:p-5">
                    <p className="text-[14px] font-medium text-foreground">
                      {he ? topic.titleHe : topic.title}
                    </p>
                    <textarea
                      value={topicState?.canonicalText || ""}
                      onChange={(e) => onCanonical(topic.id, e.target.value)}
                      placeholder={he ? topic.exampleCanonicalHe : topic.exampleCanonical}
                      rows={2}
                      className="mt-3 w-full resize-y rounded-[1.1rem] border border-black/[0.06] bg-white px-3.5 py-3 text-[14px] leading-relaxed text-foreground outline-none placeholder:text-zinc-300 focus:border-assis-blue/25 focus:ring-4 focus:ring-assis-blue/10"
                      dir="auto"
                    />
                    <button
                      type="button"
                      onClick={() => onNotRelevant(topic.id)}
                      className="mt-2 text-[12px] font-medium text-zinc-400 hover:text-foreground"
                    >
                      {t.notRelevant}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.04] bg-white/80 px-5 py-3 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl">
          <button
            type="button"
            onClick={onOpenKnowledge}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-assis-blue px-5 text-[13px] font-semibold text-white transition hover:bg-assis-blue-deep"
          >
            {t.knowledgeCta}
          </button>
        </div>
      </div>

      {openSource ? (
        <SourceSheet
          lang={lang}
          claim={openSource.claim}
          source={openSource.source}
          onClose={() => setOpenSource(null)}
        />
      ) : null}

      {confirm ? (
        <ConfirmSheet
          lang={lang}
          confirm={confirm}
          onCancel={() => setConfirm(null)}
          onConfirm={applyConfirm}
        />
      ) : null}
    </main>
  );
}

function TopicBlock({
  lang,
  topic,
  state,
  onTrue,
  onFalse,
  onOpenSource,
}: {
  lang: ClarityLang;
  topic: TopicReview;
  state: ReviewState;
  onTrue: (claim: ExtractedClaim) => void;
  onFalse: (claim: ExtractedClaim) => void;
  onOpenSource: (value: { claim: ExtractedClaim; source: ClaimSource }) => void;
}) {
  const t = COPY[lang];
  const he = lang === "he";
  const topicState = state.decisions[topic.id];
  const claims = reviewClaims(topic);

  return (
    <div>
      <p className="text-[13px] font-medium text-foreground">{he ? topic.titleHe : topic.title}</p>
      {topic.status === "conflict" ? (
        <p className="mt-0.5 text-[13px] text-muted-foreground">{t.questionClear}</p>
      ) : null}
      <div className="mt-3 space-y-3">
        {claims.map((claim) => {
          const decision = topicState?.claimDecisions[claim.id] || "pending";
          const source = claim.sources[0];
          return (
            <div
              key={claim.id}
              className={`rounded-[1.35rem] border p-4 transition sm:p-5 ${
                decision === "approved"
                  ? "border-assis-blue/15 bg-assis-blue-light/50"
                  : decision === "rejected"
                    ? "border-transparent bg-zinc-50/90"
                    : "border-black/[0.05] bg-white/90 shadow-[0_1px_2px_rgba(16,24,40,0.03),0_10px_24px_-18px_rgba(16,24,40,0.12)]"
              }`}
            >
              <p
                className={`text-[15px] leading-[1.65] ${
                  decision === "rejected" ? "text-zinc-500" : "text-foreground"
                }`}
                dir="auto"
              >
                “{claim.text}”
              </p>
              {source ? (
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
                  <span className="text-zinc-400">
                    {t.sources}{" "}
                    <span className="font-medium text-zinc-600">
                      {friendlyPageLabel(source, he ? "עמוד הבית" : "Home")}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenSource({ claim, source })}
                    className="font-medium text-assis-blue/80 transition hover:text-assis-blue"
                  >
                    {t.seeExactPlace}
                  </button>
                </div>
              ) : null}
              <div className="mt-4 flex rounded-full bg-zinc-100/90 p-1">
                <button
                  type="button"
                  aria-pressed={decision === "approved"}
                  onClick={() => onTrue(claim)}
                  className={`flex-1 rounded-full py-2 text-[13px] font-medium transition ${
                    decision === "approved"
                      ? "bg-white text-assis-blue shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.true}
                </button>
                <button
                  type="button"
                  aria-pressed={decision === "rejected"}
                  onClick={() => onFalse(claim)}
                  className={`flex-1 rounded-full py-2 text-[13px] font-medium transition ${
                    decision === "rejected"
                      ? "bg-white text-zinc-700 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.notTrue}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConfirmSheet({
  lang,
  confirm,
  onCancel,
  onConfirm,
}: {
  lang: ClarityLang;
  confirm: ConfirmAction;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const t = COPY[lang];
  const approved = confirm.against[0]?.text || "";
  const template = confirm.kind === "approve" ? t.sureApproveBody : t.sureRejectBody;
  const body = template.replace("{approved}", approved);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/20 p-4 backdrop-blur-[2px] sm:items-center"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-[1.6rem] border border-white/70 bg-white/95 p-5 shadow-[0_24px_60px_-28px_rgba(16,24,40,0.35)] sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-assis-blue/80">
          {t.sureTitle}
        </p>
        <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-muted-foreground">{body}</p>
        <p className="mt-3 rounded-[1.1rem] bg-[#f7f8fa] px-4 py-3 text-[14px] leading-relaxed text-foreground" dir="auto">
          “{confirm.claim.text}”
        </p>
        <button
          type="button"
          onClick={onConfirm}
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-assis-blue text-[13px] font-semibold text-white transition hover:bg-assis-blue-deep"
        >
          {confirm.kind === "approve" ? t.sureApproveCta : t.sureRejectCta}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="mt-1.5 inline-flex h-10 w-full items-center justify-center rounded-full text-[13px] font-medium text-muted-foreground transition hover:text-foreground"
        >
          {t.sureCancel}
        </button>
      </div>
    </div>
  );
}

function SourceSheet({
  lang,
  claim,
  source,
  onClose,
}: {
  lang: ClarityLang;
  claim: ExtractedClaim;
  source: ClaimSource;
  onClose: () => void;
}) {
  const t = COPY[lang];
  const he = lang === "he";
  const label = friendlyPageLabel(source, he ? "עמוד הבית" : "Home");
  const excerpt = source.excerpt || claim.text;
  const parts = excerpt.split(claim.text);
  const exactUrl = textFragmentUrl(source.url, claim.text);
  const previewUrl = `/api/clarity/preview?url=${encodeURIComponent(source.url)}&quote=${encodeURIComponent(claim.text)}`;
  let path = source.path;
  try {
    path = decodeURIComponent(source.path);
  } catch {
    /* keep */
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/25 p-3 backdrop-blur-[2px] sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[1.6rem] border border-white/70 bg-white/95 shadow-[0_24px_60px_-28px_rgba(16,24,40,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 sm:px-6 sm:pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-assis-blue/80">
            {t.sourceSheetTitle}
          </p>
          <h3 className="font-display mt-2 text-lg font-semibold tracking-[-0.03em] text-foreground">
            {label}
          </h3>
          <p className="mt-1 text-[12px] text-zinc-400" dir="ltr">
            {path}
          </p>
          <blockquote
            className="mt-3 rounded-[1.1rem] bg-[#f7f8fa] p-3 text-[14px] leading-relaxed text-foreground"
            dir="auto"
          >
            {parts.length === 1 ? (
              excerpt
            ) : (
              <>
                {parts[0]}
                <mark className="rounded bg-assis-blue-light px-0.5 text-foreground">{claim.text}</mark>
                {parts.slice(1).join(claim.text)}
              </>
            )}
          </blockquote>
        </div>
        <div className="relative mx-5 mt-3 min-h-[280px] flex-1 overflow-hidden rounded-[1.1rem] border border-black/[0.06] bg-[#f7f8fa] sm:mx-6">
          <p className="absolute inset-x-0 top-3 text-center text-[12px] text-zinc-400">{t.previewLoading}</p>
          <iframe
            title={label}
            src={previewUrl}
            className="relative h-[46vh] w-full min-h-[280px] bg-white"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
        <div className="px-5 py-4 sm:px-6">
          <a
            href={exactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full border border-black/[0.06] text-[13px] font-medium text-foreground transition hover:bg-zinc-50"
          >
            {t.openExactPlace}
            <MaterialIcon name="open_in_new" className="text-[16px]" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="mt-1.5 inline-flex h-10 w-full items-center justify-center rounded-full text-[13px] font-medium text-muted-foreground transition hover:text-foreground"
          >
            {t.closeSource}
          </button>
        </div>
      </div>
    </div>
  );
}
