"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { COPY, type ClarityLang } from "@/lib/clarity/copy";
import { demoMraDraft } from "@/lib/clarity/demo";
import {
  deleteCloudDraft,
  fetchCloudDraft,
  fetchCloudDrafts,
  patchCloudDraftState,
  putCloudDraft,
} from "@/lib/clarity/cloud-client";
import {
  clearLocalClarityData,
  deleteDraft,
  draftFileName,
  draftIdFor,
  listDrafts,
  loadDraft,
  parseDraftFile,
  saveDraft,
  slimDraft,
  type ClarityDraft,
  type ClarityDraftMeta,
} from "@/lib/clarity/draft";
import { autoApproveFound } from "@/lib/clarity/focus";
import { hydrateClarity } from "@/lib/clarity/hydrate";
import { qaBlocks } from "@/lib/clarity/qa";
import { applyAiAnswers, applyOpenQuestions, emptyTopicState, mergeReviewState, storageKey } from "@/lib/clarity/review-state";
import { applyScanRecommendations } from "@/lib/clarity/suggest";
import { templateQas } from "@/lib/clarity/import-kb";
import { toggleCollectId } from "@/lib/clarity/collect-fields";
import type {
  CustomQaItem,
  ExtractedClaim,
  ReviewState,
  ScanResult,
  TopicGroupId,
  TopicId,
} from "@/lib/clarity/types";
import ClarityShell from "./ClarityShell";
import DraftScreen from "./DraftScreen";
import ScanScreen from "./ScanScreen";
import StartScreen from "./StartScreen";

type Step = "start" | "scanning" | "review";
type CloudSave = "idle" | "saving" | "saved" | "error";
type CategoryScanPayload = {
  claims?: ExtractedClaim[];
  suggestions?: Array<{ topicId: TopicId; qaId: string; answer: string; missing: boolean }>;
  openQas?: Array<{ question: string; answer: string }>;
  missingQaIds?: string[];
  usedAi?: boolean;
  error?: string;
};

function scanErrorMessage(lang: ClarityLang, code?: string, fallback?: string) {
  const t = COPY[lang];
  switch (code) {
    case "invalid":
      return t.errorInvalid;
    case "private":
      return t.errorPrivate;
    case "unreachable":
      return t.errorUnreachable;
    case "blocked":
      return t.errorBlocked;
    case "timeout":
      return t.errorTimeout;
    case "empty":
      return t.errorEmpty;
    case "failed":
      return t.errorFailed;
    default:
      return fallback || t.errorFailed;
  }
}

function loadReviewState(result: ScanResult, userId?: string): ReviewState {
  try {
    const raw = window.localStorage.getItem(storageKey(result.storeUrl, userId));
    if (!raw) return mergeReviewState(result);
    return mergeReviewState(result, JSON.parse(raw) as ReviewState);
  } catch {
    return mergeReviewState(result);
  }
}

export default function ClarityApp() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const signedIn = status === "authenticated" && Boolean(session?.user?.id);
  const presetUrl = searchParams.get("url") || "";
  const wantDemo = searchParams.get("demo") === "1";

  const [lang, setLang] = useState<ClarityLang>("he");
  const [step, setStep] = useState<Step>("start");
  const [url, setUrl] = useState(presetUrl);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [state, setState] = useState<ReviewState | null>(null);
  const [error, setError] = useState("");
  const [drafts, setDrafts] = useState<ClarityDraftMeta[]>([]);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [cloudSave, setCloudSave] = useState<CloudSave>("idle");
  const [isAdmin, setIsAdmin] = useState(false);
  const [categoryScanId, setCategoryScanId] = useState<TopicGroupId | null>(null);
  const [categoryScanNote, setCategoryScanNote] = useState("");
  const fullCloudKey = useRef("");

  useLayoutEffect(() => {
    const html = document.documentElement;
    const prevLang = html.lang;
    const prevDir = html.dir;
    html.lang = lang === "he" ? "he" : "en";
    html.dir = lang === "he" ? "rtl" : "ltr";
    return () => {
      html.lang = prevLang;
      html.dir = prevDir;
    };
  }, [lang]);

  useEffect(() => {
    const savedLang = window.localStorage.getItem("clarity-lang");
    if (savedLang === "en" || savedLang === "he") setLang(savedLang);
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    let cancelled = false;

    async function boot() {
      if (!signedIn) {
        if (!cancelled) {
          setDrafts([]);
          setStep("start");
          setResult(null);
          setState(null);
        }
        return;
      }

      try {
        clearLocalClarityData();
        const cloud = await fetchCloudDrafts();
        if (cancelled) return;
        setDrafts(cloud.drafts);
        setIsAdmin(cloud.admin);
        setStep("start");
        setResult(null);
        setState(null);
        if (searchParams.get("draft")) {
          const params = new URLSearchParams();
          if (presetUrl) {
            params.set("url", presetUrl.replace(/^https?:\/\//i, "").replace(/\/$/, ""));
          }
          const query = params.toString();
          window.history.replaceState(null, "", query ? `/clarity?${query}` : "/clarity");
        }
      } catch {
        if (!cancelled) setDrafts([]);
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, signedIn]);

  useEffect(() => {
    if (!result || !state) return;
    if (status === "loading") return;
    window.localStorage.setItem(storageKey(result.storeUrl, session?.user?.id), JSON.stringify(state));
    const timer = window.setTimeout(() => {
      void persistDraft({ silent: true });
    }, 400);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, state, lang, signedIn, status]);

  useEffect(() => {
    if (step !== "scanning") return;
    const id = window.setInterval(() => {
      setScanStep((i) => Math.min(i + 1, COPY.en.scanSteps.length - 1));
    }, 1100);
    return () => window.clearInterval(id);
  }, [step]);

  function toggleLang() {
    setLang((prev) => {
      const next = prev === "he" ? "en" : "he";
      window.localStorage.setItem("clarity-lang", next);
      return next;
    });
  }

  function rememberUrl(nextUrl: string, draftId?: string) {
    const params = new URLSearchParams();
    if (nextUrl) params.set("url", nextUrl.replace(/^https?:\/\//i, "").replace(/\/$/, ""));
    if (draftId) params.set("draft", draftId);
    const query = params.toString();
    window.history.replaceState(null, "", query ? `/clarity?${query}` : "/clarity");
  }

  function openDraft(draft: ClarityDraft, options: { replaceUrl?: boolean; fromCloud?: boolean } = {}) {
    const next = hydrateClarity(draft.result, draft.state);
    setError("");
    setResult(next.result);
    setState(next.state);
    setUrl(next.result.storeUrl);
    setLang(draft.lang);
    setSavedAt(draft.savedAt);
    setStep("review");
    if (options.fromCloud) {
      fullCloudKey.current = `${next.result.storeUrl}|${next.result.scannedAt}`;
      setCloudSave("saved");
    }
    if (options.replaceUrl !== false) rememberUrl(next.result.storeUrl, draft.id);
  }

  async function persistDraft(options: { silent?: boolean } = {}) {
    if (!result || !state) return;
    let local = slimDraft({
      id: draftIdFor(result.storeUrl),
      savedAt: new Date().toISOString(),
      lang,
      result,
      state,
    });
    try {
      local = slimDraft(saveDraft({ result, state, lang }));
    } catch {
      /* localStorage quota should not block saving to the account */
    }
    setSavedAt(local.savedAt);
    rememberUrl(result.storeUrl, local.id);
    if (!signedIn) {
      setCloudSave("idle");
      setDrafts(listDrafts());
      return;
    }
    const scanKey = `${result.storeUrl}|${result.scannedAt}`;
    setCloudSave("saving");
    try {
      if (fullCloudKey.current === scanKey) {
        try {
          const patched = await patchCloudDraftState(local.id, local.state, local.lang);
          if (patched.savedAt) setSavedAt(patched.savedAt);
        } catch (error) {
          if (error instanceof Error && error.message === "need-full") {
            await putCloudDraft(slimDraft(local));
            fullCloudKey.current = scanKey;
          } else {
            throw error;
          }
        }
      } else {
        const saved = await putCloudDraft(slimDraft(local));
        setSavedAt(saved.savedAt);
        fullCloudKey.current = scanKey;
      }
      setCloudSave("saved");
      try {
        const listed = await fetchCloudDrafts();
        setDrafts(listed.drafts);
        setIsAdmin(listed.admin);
      } catch {
        /* draft is saved even if the list refresh fails */
      }
    } catch {
      setCloudSave("error");
      setDrafts(signedIn ? [] : listDrafts());
      if (!options.silent) {
        setError(
          lang === "he"
            ? "לא הצלחנו לשמור את הטיוטה לחשבון. התחברו ושמרו שוב."
            : "Couldn’t save the draft to your account. Sign in and save again.",
        );
      }
    }
  }

  function downloadCurrentDraft() {
    if (!result || !state) return;
    const draft = saveDraft({ result, state, lang });
    setSavedAt(draft.savedAt);
    setDrafts(listDrafts());
    const blob = new Blob([`${JSON.stringify(draft, null, 2)}\n`], { type: "application/json;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = draftFileName(draft);
    a.click();
    URL.revokeObjectURL(href);
  }

  async function resumeDraft(id: string) {
    if (signedIn) {
      const cloud = await fetchCloudDraft(id);
      if (!cloud) {
        const listed = await fetchCloudDrafts().catch(() => ({ drafts: [] as ClarityDraftMeta[], admin: false }));
        setDrafts(listed.drafts);
        setIsAdmin(listed.admin);
        return;
      }
      openDraft(cloud, { fromCloud: true });
      return;
    }
    const draft = loadDraft(id);
    if (!draft) {
      setDrafts(listDrafts());
      return;
    }
    openDraft(draft);
  }

  async function removeDraft(id: string) {
    deleteDraft(id);
    if (signedIn) {
      try {
        await deleteCloudDraft(id);
        const listed = await fetchCloudDrafts();
        setDrafts(listed.drafts);
        setIsAdmin(listed.admin);
      } catch {
        const listed = await fetchCloudDrafts().catch(() => ({ drafts: [] as ClarityDraftMeta[], admin: false }));
        setDrafts(listed.drafts);
        setIsAdmin(listed.admin);
      }
      return;
    }
    setDrafts(listDrafts());
  }

  async function importDraftFile(file: File) {
    const text = await file.text();
    const draft = parseDraftFile(text, { fileName: file.name });
    if (!draft) {
      setError(lang === "he" ? "לא הצלחנו לקרוא את קובץ הטיוטה." : "That draft file couldn’t be read.");
      return;
    }
    saveDraft(draft);
    if (signedIn) {
      try {
        setCloudSave("saving");
        await putCloudDraft(slimDraft(draft));
        setCloudSave("saved");
        const listed = await fetchCloudDrafts();
        setDrafts(listed.drafts);
        setIsAdmin(listed.admin);
      } catch {
        setCloudSave("error");
        setDrafts(listDrafts());
      }
    } else {
      setCloudSave("idle");
      setDrafts(listDrafts());
    }
    openDraft(draft);
  }

  async function runScan(options: { demo?: boolean; nextUrl?: string } = {}) {
    if (!signedIn) {
      setStep("start");
      return;
    }
    const nextUrl = options.nextUrl ?? url;
    setError("");
    setScanStep(0);
    setStep("scanning");
    setResult(null);
    setState(null);

    try {
      if (options.demo) {
        await new Promise((resolve) => window.setTimeout(resolve, 1400));
        const demo = demoMraDraft();
        const next = hydrateClarity(demo.result, demo.state);
        setResult(next.result);
        setState(next.state);
        setUrl(next.result.storeUrl);
        setStep("review");
        rememberUrl(next.result.storeUrl, draftIdFor(next.result.storeUrl));
        return;
      }

      const response = await fetch("/api/clarity/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: nextUrl, demo: false, lang }),
      });
      const data = (await response.json()) as ScanResult & {
        error?: string;
        code?: string;
        aiAnswers?: Array<{ topicId: TopicId; qaId: string; answer: string; missing?: boolean }>;
        openQas?: Array<{ question: string; answer: string }>;
        usedAi?: boolean;
      };
      if (!response.ok) throw new Error(scanErrorMessage(lang, data.code, data.error));
      const next = hydrateClarity(data, loadReviewState(data, session?.user?.id));
      const withAi = applyOpenQuestions(
        applyAiAnswers(next.state, data.aiAnswers || []),
        data.openQas || [],
        templateQas().map((item) => item.question),
      );
      const withScan = { ...withAi, customQas: applyScanRecommendations(next.result, withAi) };
      setResult(next.result);
      setState(autoApproveFound(next.result, withScan));
      setUrl(next.result.storeUrl);
      setStep("review");
      rememberUrl(next.result.storeUrl, draftIdFor(next.result.storeUrl));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
      setStep("start");
    }
  }

  function pickQa(topicId: TopicId, qaId: string, claimId: string) {
    setState((prev) => {
      if (!prev || !result) return prev;
      const topic = result.topics.find((item) => item.id === topicId);
      const topicState = prev.decisions[topicId] || emptyTopicState();
      if (!topic) return prev;
      const claimDecisions = {
        ...topicState.claimDecisions,
        [claimId]: "approved" as const,
      };
      const approved = topic.claims.find((claim) => claim.id === claimId);
      const existing = topicState.qaAnswers?.[qaId] || "";
      return {
        ...prev,
        decisions: {
          ...prev.decisions,
          [topicId]: {
            ...topicState,
            claimDecisions,
            qaAnswers: {
              ...(topicState.qaAnswers || {}),
              [qaId]: existing.trim() ? existing : approved?.text || "",
            },
            qaSkip: { ...(topicState.qaSkip || {}), [qaId]: false },
            canonicalText: topicState.canonicalText || existing.trim() || approved?.text || "",
            notRelevant: false,
          },
        },
      };
    });
  }

  function rejectQaClaim(topicId: TopicId, qaId: string, claimId: string) {
    setState((prev) => {
      if (!prev || !result) return prev;
      const topic = result.topics.find((item) => item.id === topicId);
      const topicState = prev.decisions[topicId] || emptyTopicState();
      if (!topic) return prev;
      const block = qaBlocks(topic, prev).find((item) => item.def.id === qaId);
      const claim = block?.claims.find((item) => item.id === claimId);
      const claimDecisions = { ...topicState.claimDecisions, [claimId]: "rejected" as const };
      const qaAnswers = { ...(topicState.qaAnswers || {}) };
      if (claim && qaAnswers[qaId] === claim.text) qaAnswers[qaId] = "";
      const allRejected =
        (block?.claims.length || 0) > 0 &&
        (block?.claims || []).every((item) => claimDecisions[item.id] === "rejected");
      return {
        ...prev,
        decisions: {
          ...prev.decisions,
          [topicId]: {
            ...topicState,
            claimDecisions,
            qaAnswers,
            qaSkip: { ...(topicState.qaSkip || {}), [qaId]: allRejected },
            notRelevant: false,
          },
        },
      };
    });
  }

  function setQaAnswer(topicId: TopicId, qaId: string, text: string) {
    setState((prev) => {
      if (!prev) return prev;
      const topicState = prev.decisions[topicId] || emptyTopicState();
      return {
        ...prev,
        decisions: {
          ...prev.decisions,
          [topicId]: {
            ...topicState,
            qaAnswers: { ...(topicState.qaAnswers || {}), [qaId]: text },
            qaSkip: { ...(topicState.qaSkip || {}), [qaId]: false },
            canonicalText: topicState.canonicalText || text,
            notRelevant: false,
          },
        },
      };
    });
  }

  function saveQaEdit(topicId: TopicId, qaId: string, text: string, claimId?: string) {
    setState((prev) => {
      if (!prev) return prev;
      const topicState = prev.decisions[topicId] || emptyTopicState();
      const claimDecisions = { ...topicState.claimDecisions };
      if (claimId) claimDecisions[claimId] = "approved";
      return {
        ...prev,
        decisions: {
          ...prev.decisions,
          [topicId]: {
            ...topicState,
            claimDecisions,
            qaAnswers: { ...(topicState.qaAnswers || {}), [qaId]: text },
            qaSkip: { ...(topicState.qaSkip || {}), [qaId]: false },
            canonicalText: text.trim() || topicState.canonicalText,
            notRelevant: false,
          },
        },
      };
    });
  }

  function skipQa(topicId: TopicId, qaId: string) {
    setState((prev) => {
      if (!prev) return prev;
      const topicState = prev.decisions[topicId] || emptyTopicState();
      return {
        ...prev,
        decisions: {
          ...prev.decisions,
          [topicId]: {
            ...topicState,
            qaSkip: { ...(topicState.qaSkip || {}), [qaId]: true },
          },
        },
      };
    });
  }

  function unskipQa(topicId: TopicId, qaId: string) {
    setState((prev) => {
      if (!prev) return prev;
      const topicState = prev.decisions[topicId] || emptyTopicState();
      return {
        ...prev,
        decisions: {
          ...prev.decisions,
          [topicId]: {
            ...topicState,
            qaSkip: { ...(topicState.qaSkip || {}), [qaId]: false },
          },
        },
      };
    });
  }

  function addCustomQa(groupId: TopicGroupId, section: CustomQaItem["section"], detailName?: string) {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        customQas: [
          ...(prev.customQas || []),
          {
            id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            groupId,
            section,
            question: "",
            answer: "",
            detailName:
              detailName?.trim() || (groupId === "open" ? "שאלות פתוחות" : "שאלות נוספות"),
            forCustomers: section !== "process",
          },
        ],
      };
    });
  }

  function updateCustomQa(id: string, patch: Partial<CustomQaItem>) {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        customQas: (prev.customQas || []).map((item) => (item.id === id ? { ...item, ...patch } : item)),
      };
    });
  }

  function toggleQaCollect(topicId: TopicId, qaId: string, fieldId: string) {
    setState((prev) => {
      if (!prev) return prev;
      const topicState = prev.decisions[topicId] || emptyTopicState();
      return {
        ...prev,
        decisions: {
          ...prev.decisions,
          [topicId]: {
            ...topicState,
            qaCollect: {
              ...(topicState.qaCollect || {}),
              [qaId]: toggleCollectId(topicState.qaCollect?.[qaId], fieldId),
            },
          },
        },
      };
    });
  }

  async function runCategoryScan(groupId: TopicGroupId) {
    if (!result || !signedIn || categoryScanId) return;
    setCategoryScanId(groupId);
    setCategoryScanNote("");
    try {
      const response = await fetch("/api/clarity/category-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: result.storeUrl, groupId, lang }),
      });
      const data = (await response.json()) as CategoryScanPayload;
      if (!response.ok) throw new Error(data.error || "scan");
      const claims = data.claims || [];
      const suggestions = data.suggestions || [];
      const mergedResult = {
        ...result,
        topics: result.topics.map((topic) => {
          if (topic.group !== groupId) return topic;
          const extra = claims.filter((claim) => claim.topicId === topic.id);
          if (extra.length === 0) return topic;
          const seen = new Set(topic.claims.map((claim) => claim.id));
          const merged = [...topic.claims];
          for (const claim of extra) {
            if (!seen.has(claim.id)) {
              seen.add(claim.id);
              merged.push(claim);
            }
          }
          return {
            ...topic,
            claims: merged.slice(0, 16),
            status: merged.length ? (topic.status === "missing" ? "clear" : topic.status) : topic.status,
          };
        }),
      };
      setResult(mergedResult);

      setState((prev) => {
        if (!prev) return prev;
        const next = { ...prev, decisions: { ...prev.decisions } };
        for (const claim of claims) {
          const topicState = next.decisions[claim.topicId] || emptyTopicState();
          if (topicState.claimDecisions[claim.id]) {
            next.decisions[claim.topicId] = topicState;
            continue;
          }
          next.decisions[claim.topicId] = {
            ...topicState,
            claimDecisions: { ...topicState.claimDecisions, [claim.id]: "pending" },
          };
        }
        const withAi = applyOpenQuestions(
          applyAiAnswers(next, suggestions),
          data.openQas || [],
          templateQas().map((item) => item.question),
        );
        return { ...withAi, customQas: applyScanRecommendations(mergedResult, withAi) };
      });

      const missing = data.missingQaIds?.length || 0;
      setCategoryScanNote(
        missing > 0
          ? COPY[lang].categoryScanMissing.replace("{n}", String(missing))
          : data.usedAi
            ? COPY[lang].categoryScanDone
            : COPY[lang].categoryScanNoAi,
      );
    } catch {
      setCategoryScanNote(COPY[lang].categoryScanError);
    } finally {
      setCategoryScanId(null);
    }
  }

  function reset() {
    setStep("start");
    setResult(null);
    setState(null);
    setError("");
    setCloudSave("idle");
    if (!presetUrl) setUrl("");
    window.history.replaceState(null, "", "/clarity");
  }

  return (
    <ClarityShell lang={lang} onToggleLang={toggleLang}>
      {step === "start" ? (
        <>
          <StartScreen
            lang={lang}
            url={url}
            onUrlChange={setUrl}
            onScan={() => runScan()}
            onDemo={() => runScan({ demo: true })}
            drafts={drafts}
            signedIn={signedIn}
            accountLabel={session?.user?.name || session?.user?.email || ""}
            onResumeDraft={(id) => void resumeDraft(id)}
            onDeleteDraft={(id) => void removeDraft(id)}
            onImportDraft={importDraftFile}
            isAdmin={isAdmin}
          />
          {error ? (
            <div className="mx-auto max-w-xl px-4 pb-12 sm:px-8">
              <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4">
                <p className="text-sm font-semibold text-amber-900">{COPY[lang].errorTitle}</p>
                <p className="mt-1 text-sm text-amber-800">{error}</p>
                <button
                  type="button"
                  onClick={() => runScan({ demo: true })}
                  className="mt-3 text-sm font-semibold text-assis-blue"
                >
                  {COPY[lang].tryDemo}
                </button>
              </div>
            </div>
          ) : null}
          {wantDemo && !error ? (
            <div className="mx-auto max-w-xl px-5 pb-10 sm:px-8">
              <button
                type="button"
                onClick={() => runScan({ demo: true })}
                className="text-sm font-semibold text-assis-blue"
              >
                {COPY[lang].demoCta} →
              </button>
            </div>
          ) : null}
        </>
      ) : null}

      {step === "scanning" ? (
        <ScanScreen lang={lang} stepIndex={scanStep} storeLabel={url} />
      ) : null}

      {step === "review" && result && state ? (
        <DraftScreen
          lang={lang}
          result={result}
          state={state}
          savedAt={savedAt}
          cloudSave={cloudSave}
          onPickQa={pickQa}
          onRejectQa={rejectQaClaim}
          onQaAnswer={setQaAnswer}
          onSaveEdit={saveQaEdit}
          onSkipQa={skipQa}
          onUnskipQa={unskipQa}
          onAddCustomQa={addCustomQa}
          onUpdateCustomQa={updateCustomQa}
          onToggleQaCollect={toggleQaCollect}
          signedIn={signedIn}
          onSaveDraft={() => void persistDraft()}
          onDownloadDraft={downloadCurrentDraft}
          onBack={reset}
          onRescan={reset}
          onCategoryScan={(groupId) => void runCategoryScan(groupId)}
          categoryScanId={categoryScanId}
          categoryScanNote={categoryScanNote}
        />
      ) : null}
    </ClarityShell>
  );
}
