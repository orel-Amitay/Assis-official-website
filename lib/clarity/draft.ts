import type { ClarityLang } from "./copy";
import { draftFromKnowledgeBase, guessStoreFromKbFile, isKnowledgeBaseJson } from "./import-kb";
import type { ReviewState, ScanResult } from "./types";

export type ClarityDraft = {
  id: string;
  savedAt: string;
  lang: ClarityLang;
  result: ScanResult;
  state: ReviewState;
};

export type ClarityDraftMeta = {
  id: string;
  storeUrl: string;
  storeName: string;
  savedAt: string;
  scannedAt: string;
  pages: number;
  demo?: boolean;
};

const INDEX_KEY = "clarity-drafts";

export function draftIdFor(storeUrl: string) {
  return storeUrl.replace(/^https?:\/\//i, "").replace(/\/$/, "").toLowerCase();
}

export function draftStorageKey(id: string) {
  return `clarity-draft:${id}`;
}

function readIndex(): ClarityDraftMeta[] {
  try {
    const raw = window.localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ClarityDraftMeta[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeIndex(index: ClarityDraftMeta[]) {
  window.localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

export function listDrafts(): ClarityDraftMeta[] {
  return readIndex().sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1));
}

export function loadDraft(id: string): ClarityDraft | null {
  try {
    const raw = window.localStorage.getItem(draftStorageKey(id));
    if (!raw) return null;
    const draft = JSON.parse(raw) as ClarityDraft;
    if (!draft?.result?.topics || !draft?.state?.decisions) return null;
    return draft;
  } catch {
    return null;
  }
}

export function findDraftByUrl(storeUrl: string): ClarityDraft | null {
  const wanted = draftIdFor(storeUrl).replace(/^www\./, "");
  const direct = loadDraft(wanted) || loadDraft(`www.${wanted}`) || loadDraft(draftIdFor(storeUrl));
  if (direct) return direct;

  for (const meta of listDrafts()) {
    const id = meta.id.replace(/^www\./, "");
    const urlId = draftIdFor(meta.storeUrl).replace(/^www\./, "");
    if (id === wanted || urlId === wanted) {
      const draft = loadDraft(meta.id);
      if (draft) return draft;
    }
  }
  return null;
}

export function slimDraft(draft: ClarityDraft): ClarityDraft {
  return {
    ...draft,
    result: {
      storeUrl: draft.result.storeUrl,
      storeName: draft.result.storeName,
      scannedAt: draft.result.scannedAt,
      demo: draft.result.demo,
      pagesScanned: draft.result.pagesScanned,
      topics: draft.result.topics.map((topic) => ({
        ...topic,
        aiWhy: "",
        aiWhyHe: "",
        writeChecklist: [],
        writeChecklistHe: [],
        matchedPages: topic.matchedPages.slice(0, 8).map((source) => ({
          url: source.url,
          pageTitle: source.pageTitle,
          path: source.path,
        })),
        claims: topic.claims.map((claim) => ({
          ...claim,
          sources: claim.sources.slice(0, 5).map((source) => ({
            url: source.url,
            pageTitle: source.pageTitle,
            path: source.path,
            excerpt: source.excerpt?.slice(0, 280),
          })),
        })),
      })),
    },
  };
}

export function saveDraft(input: {
  result: ScanResult;
  state: ReviewState;
  lang: ClarityLang;
}): ClarityDraft {
  const draft: ClarityDraft = {
    id: draftIdFor(input.result.storeUrl),
    savedAt: new Date().toISOString(),
    lang: input.lang,
    result: input.result,
    state: input.state,
  };
  window.localStorage.setItem(draftStorageKey(draft.id), JSON.stringify(draft));
  const meta: ClarityDraftMeta = {
    id: draft.id,
    storeUrl: input.result.storeUrl,
    storeName: input.result.storeName,
    savedAt: draft.savedAt,
    scannedAt: input.result.scannedAt,
    pages: input.result.pagesScanned.length,
    demo: input.result.demo,
  };
  writeIndex([meta, ...readIndex().filter((item) => item.id !== draft.id)]);
  return draft;
}

export function deleteDraft(id: string) {
  window.localStorage.removeItem(draftStorageKey(id));
  writeIndex(readIndex().filter((item) => item.id !== id));
}

export function clearLocalClarityData() {
  const index = readIndex();
  for (const meta of index) {
    window.localStorage.removeItem(draftStorageKey(meta.id));
  }
  window.localStorage.removeItem(INDEX_KEY);
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (!key) continue;
    if (key.startsWith("clarity-draft:") || key.startsWith("clarity-review:")) keys.push(key);
  }
  for (const key of keys) window.localStorage.removeItem(key);
}

export function parseDraftFile(raw: string, options?: { fileName?: string }): ClarityDraft | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (isKnowledgeBaseJson(parsed)) {
      return draftFromKnowledgeBase(parsed, guessStoreFromKbFile(options?.fileName));
    }
    if (parsed && typeof parsed === "object" && "sections" in parsed && "name" in parsed) {
      return null;
    }
    const candidate =
      parsed && typeof parsed === "object" && "draft" in parsed
        ? (parsed as { draft?: unknown }).draft
        : parsed;
    const draft = candidate as ClarityDraft | undefined;
    if (!draft?.result?.topics || !draft?.state?.decisions) return null;
    return {
      ...draft,
      id: draft.id || draftIdFor(draft.result.storeUrl),
      savedAt: draft.savedAt || new Date().toISOString(),
      lang: draft.lang === "en" ? "en" : "he",
    };
  } catch {
    return null;
  }
}

export function draftFileName(draft: Pick<ClarityDraft, "result">) {
  const host = draft.result.storeName.replace(/\s+/g, "-").toLowerCase() || "store";
  return `${host}-clarity-draft.json`;
}
