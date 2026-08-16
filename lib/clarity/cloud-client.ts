import type { ClarityLang } from "./copy";
import type { ClarityDraft, ClarityDraftMeta } from "./draft";
import type { ReviewState } from "./types";

async function readJson<T>(response: Response) {
  return (await response.json()) as T;
}

export async function fetchCloudDrafts(): Promise<{ drafts: ClarityDraftMeta[]; admin: boolean }> {
  const response = await fetch("/api/clarity/drafts", { cache: "no-store" });
  if (response.status === 401) throw new Error("auth");
  if (!response.ok) throw new Error("cloud-list");
  const data = await readJson<{ drafts?: ClarityDraftMeta[]; admin?: boolean }>(response);
  return {
    drafts: Array.isArray(data.drafts) ? data.drafts : [],
    admin: Boolean(data.admin),
  };
}

export async function fetchCloudDraft(id: string): Promise<ClarityDraft | null> {
  const response = await fetch(`/api/clarity/drafts/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (response.status === 401 || response.status === 404) return null;
  if (!response.ok) throw new Error("cloud-get");
  const data = await readJson<{ draft?: ClarityDraft }>(response);
  return data.draft || null;
}

export async function patchCloudDraftState(
  id: string,
  state: ReviewState,
  lang: ClarityLang,
  options?: { keepalive?: boolean },
) {
  const response = await fetch("/api/clarity/drafts", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stateOnly: true, id, state, lang }),
    cache: "no-store",
    keepalive: Boolean(options?.keepalive),
  });
  if (response.status === 401) throw new Error("auth");
  if (response.status === 409) throw new Error("need-full");
  if (!response.ok) {
    const data = await readJson<{ error?: string }>(response).catch(() => ({ error: "" }));
    throw new Error(data.error || "cloud-save");
  }
  return readJson<{ ok?: boolean; savedAt?: string }>(response);
}

export async function putCloudDraft(draft: ClarityDraft, options?: { keepalive?: boolean }): Promise<ClarityDraft> {
  const response = await fetch("/api/clarity/drafts", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
    cache: "no-store",
    keepalive: Boolean(options?.keepalive),
  });
  if (response.status === 401) throw new Error("auth");
  if (!response.ok) {
    const data = await readJson<{ error?: string }>(response).catch(() => ({ error: "" }));
    throw new Error(data.error || "cloud-save");
  }
  const data = await readJson<{ draft?: ClarityDraft }>(response);
  return data.draft || draft;
}

export async function deleteCloudDraft(id: string) {
  const response = await fetch(`/api/clarity/drafts/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (response.status === 401) throw new Error("auth");
  if (!response.ok && response.status !== 404) throw new Error("cloud-delete");
}
