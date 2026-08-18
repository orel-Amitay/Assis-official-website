export type ClarityAccount = {
  id: string;
  email?: string | null;
  googleSub?: string | null;
};

export function normalizeAccountEmail(email?: string | null) {
  return String(email || "").trim().toLowerCase();
}

export function isPasswordUserId(id?: string | null) {
  return String(id || "").startsWith("pass:");
}

export function canonicalClarityUserId(input: {
  id?: string | null;
  email?: string | null;
}) {
  const id = String(input.id || "").trim();
  if (isPasswordUserId(id)) return id;
  const email = normalizeAccountEmail(input.email);
  if (email) return `google:${email}`;
  return id;
}

export function googleSubAliases(googleSub?: string | null) {
  const sub = String(googleSub || "").trim();
  if (!sub || isPasswordUserId(sub)) return [] as string[];
  if (sub.startsWith("google:")) {
    const raw = sub.slice("google:".length);
    return raw ? [sub, raw] : [sub];
  }
  return [sub, `google:${sub}`];
}

export function ownerIdCandidates(account: ClarityAccount) {
  const ids = new Set<string>();
  const add = (value?: string | null) => {
    const id = String(value || "").trim();
    if (id) ids.add(id);
  };
  const email = normalizeAccountEmail(account.email);
  add(account.id);
  add(canonicalClarityUserId(account));
  if (email) add(`google:${email}`);
  for (const alias of googleSubAliases(account.googleSub)) add(alias);
  if (!isPasswordUserId(account.id)) {
    for (const alias of googleSubAliases(account.id)) add(alias);
  }
  return [...ids];
}
