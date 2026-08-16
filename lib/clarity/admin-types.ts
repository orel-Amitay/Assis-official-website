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
  questionnaire: Array<{
    id: string;
    groupId: string;
    detailName?: string;
    question: string;
    answer: string;
    skipped?: boolean;
    notApplicable?: boolean;
    suggestedAnswer?: string;
    verdict?: string;
    sourceUrl?: string;
    sourceTitle?: string;
    section?: string;
  }>;
};
