"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { COPY, type ClarityLang } from "@/lib/clarity/copy";
import { shortDashes } from "@/lib/clarity/text";
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
import ScanScreen, { type ScanFillProgress } from "./ScanScreen";
import StartScreen from "./StartScreen";

type Step = "start" | "scanning" | "review";
type CloudSave = "idle" | "saving" | "saved" | "error";

function reviewHash(state: ReviewState | null, lang: ClarityLang) {
  if (!state) return "";
  return JSON.stringify({ lang, customQas: state.customQas, decisions: state.decisions });
}
type CategoryScanPayload = {
  claims?: ExtractedClaim[];
  suggestions?: Array<{ topicId: TopicId; qaId: string; answer: string; missing: boolean }>;
  openQas?: Array<{ question: string; answer: string }>;
  missingQaIds?: string[];
  usedAi?: boolean;
  error?: string;
};

type ScanApiPayload = ScanResult & {
  error?: string;
  code?: string;
  aiAnswers?: Array<{ topicId: TopicId; qaId: string; answer: string; missing?: boolean }>;
  openQas?: Array<{ question: string; answer: string }>;
  usedAi?: boolean;
};

async function readScanResponse(
  response: Response,
  onFill: (fill: ScanFillProgress) => void,
): Promise<ScanApiPayload> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("ndjson") || !response.body) {
    return (await response.json()) as ScanApiPayload;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let donePayload: ScanApiPayload | null = null;
  const applyEvent = (line: string) => {
    if (!line.trim()) return "continue";
    let event: {
      type?: string;
      phase?: string;
      groupTitle?: string;
      done?: number;
      total?: number;
      etaSec?: number;
      result?: ScanApiPayload;
      error?: string;
      code?: string;
    };
    try {
      event = JSON.parse(line) as typeof event;
    } catch {
      return "continue";
    }
    if (event.type === "phase" && event.phase === "fill") {
      onFill({ groupTitle: "", done: 0, total: 0, etaSec: 0 });
    }
    if (event.type === "fill") {
      onFill({
        groupTitle: String(event.groupTitle || ""),
        done: Number(event.done || 0),
        total: Number(event.total || 0),
        etaSec: Number(event.etaSec || 0),
      });
    }
    if (event.type === "done" && event.result) donePayload = event.result;
    if (event.type === "error") {
      return { error: event.error, code: event.code } as ScanApiPayload;
    }
    return "continue";
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const result = applyEvent(line);
      if (result && result !== "continue") return result;
    }
  }
  buffer += decoder.decode();
  const last = applyEvent(buffer);
  if (last && last !== "continue") return last;
  if (donePayload) return donePayload;
  return { error: "Scan failed", code: "failed" } as ScanApiPayload;
}

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
  const [scanFill, setScanFill] = useState<ScanFillProgress | null>(null);
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
  const persistNowRef = useRef<(options?: { silent?: boolean; full?: boolean; keepalive?: boolean }) => Promise<void>>(
    async () => {},
  );
  const resultRef = useRef(result);
  const stateRef = useRef(state);
  const langRef = useRef(lang);
  const signedInRef = useRef(signedIn);
  const saveBusyRef = useRef(false);
  const saveAgainRef = useRef(false);
  const saveFullRef = useRef(false);
  const saveFailRef = useRef(0);
  const lastPersistedHash = useRef("");
  const lastResultKey = useRef("");
  resultRef.current = result;
  stateRef.current = state;
  langRef.current = lang;
  signedInRef.current = signedIn;

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
          setError("");
          setStep("start");
          setResult(null);
          setState(null);
        }
        return;
      }

      try {
        const cloud = await fetchCloudDrafts();
        if (cancelled) return;
        setError("");
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
      } catch (error) {
        if (!cancelled) {
          setDrafts([]);
          const detail = error instanceof Error && error.message && error.message !== "cloud-list" ? error.message : "";
          setError(
            lang === "he"
              ? `לא הצלחנו לטעון את הסריקות מהחשבון. רעננו את העמוד או התחברו מחדש.${detail ? ` (${detail})` : ""}`
              : `We couldn’t load the scans for this account. Refresh or sign in again.${detail ? ` (${detail})` : ""}`,
          );
        }
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
    if (reviewHash(state, lang) === lastPersistedHash.current) return;
    saveFailRef.current = 0;
    const timer = window.setTimeout(() => {
      void persistNowRef.current({ silent: true });
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, state, lang, signedIn, status]);

  useEffect(() => {
    const flush = () => {
      void persistNowRef.current({ silent: true, keepalive: true });
    };
    const onVis = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (step !== "scanning") return;
    if (scanFill) {
      setScanStep(COPY.en.scanSteps.length - 1);
      return;
    }
    const lastCrawl = COPY.en.scanSteps.length - 2;
    const id = window.setInterval(() => {
      setScanStep((i) => Math.min(i + 1, lastCrawl));
    }, 1100);
    return () => window.clearInterval(id);
  }, [step, scanFill]);

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
      lastPersistedHash.current = reviewHash(next.state, draft.lang);
      setCloudSave("saved");
    }
    if (options.replaceUrl !== false) rememberUrl(next.result.storeUrl, draft.id);
  }

  async function persistDraft(options: { silent?: boolean; full?: boolean; keepalive?: boolean } = {}) {
    if (!resultRef.current || !stateRef.current) return;
    if (options.full) saveFullRef.current = true;
    if (saveBusyRef.current) {
      saveAgainRef.current = true;
      return;
    }
    saveBusyRef.current = true;
    try {
      do {
        saveAgainRef.current = false;
        const snapResult = resultRef.current;
        const snapState = stateRef.current;
        const snapLang = langRef.current;
        if (!snapResult || !snapState) break;
        const hash = reviewHash(snapState, snapLang);
        if (hash === lastPersistedHash.current && !options.full && !saveFullRef.current && !options.keepalive) {
          setCloudSave("saved");
          continue;
        }
        let local = slimDraft({
          id: draftIdFor(snapResult.storeUrl),
          savedAt: new Date().toISOString(),
          lang: snapLang,
          result: snapResult,
          state: snapState,
        });
        try {
          local = slimDraft(saveDraft({ result: snapResult, state: snapState, lang: snapLang }));
        } catch {
          /* localStorage quota should not block saving to the account */
        }
        setSavedAt(local.savedAt);
        rememberUrl(snapResult.storeUrl, local.id);
        if (!signedInRef.current) {
          lastPersistedHash.current = hash;
          setCloudSave("saved");
          setDrafts(listDrafts());
          continue;
        }
        const scanKey = `${snapResult.storeUrl}|${snapResult.scannedAt}`;
        const resultKey = `${scanKey}|${snapResult.topics.reduce((sum, topic) => sum + topic.claims.length, 0)}|${
          snapResult.pagesScanned.length
        }`;
        const needFull =
          Boolean(options.full) ||
          saveFullRef.current ||
          fullCloudKey.current !== scanKey ||
          lastResultKey.current !== resultKey;
        setCloudSave("saving");
        try {
          if (!needFull) {
            try {
              const patched = await patchCloudDraftState(local.id, local.state, local.lang, {
                keepalive: options.keepalive,
              });
              if (patched.savedAt) setSavedAt(patched.savedAt);
            } catch (error) {
              if (error instanceof Error && error.message === "need-full") {
                await putCloudDraft(slimDraft(local), { keepalive: options.keepalive });
                fullCloudKey.current = scanKey;
                lastResultKey.current = resultKey;
                saveFullRef.current = false;
              } else {
                throw error;
              }
            }
          } else {
            const saved = await putCloudDraft(slimDraft(local), { keepalive: options.keepalive });
            setSavedAt(saved.savedAt);
            fullCloudKey.current = scanKey;
            lastResultKey.current = resultKey;
            saveFullRef.current = false;
          }
          lastPersistedHash.current = hash;
          saveFailRef.current = 0;
          setCloudSave("saved");
          if (!options.silent) {
            try {
              const listed = await fetchCloudDrafts();
              setDrafts(listed.drafts);
              setIsAdmin(listed.admin);
            } catch {
              /* draft is saved even if the list refresh fails */
            }
          }
        } catch {
          saveFailRef.current += 1;
          if (saveFailRef.current < 4) saveAgainRef.current = true;
          setCloudSave("error");
        }
      } while (saveAgainRef.current);
    } finally {
      saveBusyRef.current = false;
      if (saveAgainRef.current) {
        void persistDraft({ silent: true });
      }
    }
  }

  persistNowRef.current = persistDraft;

  async function resumeDraft(id: string) {
    setError("");
    try {
      if (signedIn) {
        const cloud = await fetchCloudDraft(id);
        if (!cloud) {
          setError(lang === "he" ? "לא הצלחנו לפתוח את השאלון." : "That questionnaire couldn’t be opened.");
          return;
        }
        openDraft(cloud, { fromCloud: true });
        return;
      }
      const draft = loadDraft(id);
      if (!draft) {
        setDrafts(listDrafts());
        setError(lang === "he" ? "לא הצלחנו לפתוח את השאלון." : "That questionnaire couldn’t be opened.");
        return;
      }
      openDraft(draft);
    } catch {
      setError(lang === "he" ? "לא הצלחנו לפתוח את השאלון." : "That questionnaire couldn’t be opened.");
    }
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
    setScanFill(null);
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
      const data = await readScanResponse(response, (fill) => setScanFill(fill));
      if (!response.ok && !data.storeUrl) throw new Error(scanErrorMessage(lang, data.code, data.error));
      if (data.error && !data.storeUrl) throw new Error(scanErrorMessage(lang, data.code, data.error));
      const next = hydrateClarity(data, loadReviewState(data, session?.user?.id));
      const withAi = applyOpenQuestions(
        applyAiAnswers(next.state, data.aiAnswers || [], data.pagesScanned || [], next.result),
        data.openQas || [],
        templateQas().map((item) => item.question),
      );
      const withScan = { ...withAi, customQas: applyScanRecommendations(next.result, withAi) };
      lastPersistedHash.current = "";
      saveFullRef.current = true;
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
      return {
        ...prev,
        decisions: {
          ...prev.decisions,
          [topicId]: {
            ...topicState,
            claimDecisions,
            qaAnswers,
            qaSkip: { ...(topicState.qaSkip || {}), [qaId]: false },
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
            qaAnswers: { ...(topicState.qaAnswers || {}), [qaId]: shortDashes(text) },
            qaSkip: { ...(topicState.qaSkip || {}), [qaId]: false },
            canonicalText: topicState.canonicalText || text,
            notRelevant: false,
          },
        },
      };
    });
  }

  function setQaQuestion(topicId: TopicId, qaId: string, text: string) {
    setState((prev) => {
      if (!prev) return prev;
      const topicState = prev.decisions[topicId] || emptyTopicState();
      return {
        ...prev,
        decisions: {
          ...prev.decisions,
          [topicId]: {
            ...topicState,
            qaQuestions: { ...(topicState.qaQuestions || {}), [qaId]: shortDashes(text) },
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
      else claimDecisions[`qa:${qaId}`] = "approved";
      return {
        ...prev,
        decisions: {
          ...prev.decisions,
          [topicId]: {
            ...topicState,
            claimDecisions,
            qaAnswers: { ...(topicState.qaAnswers || {}), [qaId]: shortDashes(text) },
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
              detailName?.trim() || (groupId === "extra" ? "מידע נוסף" : "שאלות נוספות"),
            forCustomers: section !== "process",
            keepVisible: true,
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
        customQas: (prev.customQas || []).map((item) =>
          item.id === id
            ? {
                ...item,
                ...patch,
                ...(typeof patch.answer === "string" ? { answer: shortDashes(patch.answer) } : {}),
                ...(typeof patch.question === "string" ? { question: shortDashes(patch.question) } : {}),
              }
            : item,
        ),
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
      saveFullRef.current = true;
      lastPersistedHash.current = "";

      setState((prev) => {
        if (!prev) return prev;
        const next = {
          ...prev,
          decisions: { ...prev.decisions },
          customQas: (prev.customQas || []).map((qa) =>
            qa.groupId === groupId
              ? {
                  ...qa,
                  answer: "",
                  suggestedAnswer: "",
                  skipped: false,
                  notApplicable: false,
                  verdict: "pending" as const,
                  sourceUrl: undefined,
                  sourceTitle: undefined,
                  sourcePath: undefined,
                  sourceQuote: undefined,
                }
              : qa,
          ),
        };
        for (const topic of mergedResult.topics.filter((item) => item.group === groupId)) {
          next.decisions[topic.id] = emptyTopicState();
        }
        for (const claim of claims) {
          const topicState = next.decisions[claim.topicId] || emptyTopicState();
          next.decisions[claim.topicId] = {
            ...topicState,
            claimDecisions: { ...topicState.claimDecisions, [claim.id]: "pending" },
          };
        }
        const withAi = applyOpenQuestions(
          applyAiAnswers(next, suggestions, mergedResult.pagesScanned || [], mergedResult),
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
            isAdmin={
              isAdmin ||
              String(session?.user?.email || "")
                .trim()
                .toLowerCase()
                .endsWith("@assis.care")
            }
            error={error}
          />
          {error && step !== "start" ? (
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
        <ScanScreen lang={lang} stepIndex={scanStep} storeLabel={url} fill={scanFill} />
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
          onQaQuestion={setQaQuestion}
          onSaveEdit={saveQaEdit}
          onSkipQa={skipQa}
          onUnskipQa={unskipQa}
          onAddCustomQa={addCustomQa}
          onUpdateCustomQa={updateCustomQa}
          onToggleQaCollect={toggleQaCollect}
          signedIn={signedIn}
          onSaveDraft={() => void persistDraft()}
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
