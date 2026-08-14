import type { ClarityLang } from "./copy";
import type { KnowledgeCategory } from "./review-state";

export type AdminDraftAnswers = {
  userId: string;
  email: string | null;
  name: string | null;
  username: string | null;
  draftId: string;
  storeUrl: string;
  storeName: string;
  savedAt: string;
  deleted: boolean;
  lang: ClarityLang;
  answers: KnowledgeCategory[];
};
