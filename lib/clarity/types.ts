export type TopicGroupId =
  | "site_qa"
  | "general"
  | "delivery"
  | "returns"
  | "warranty"
  | "products"
  | "integrations"
  | "promos"
  | "influencers"
  | "service"
  | "billing"
  | "notes"
  | "prebuy"
  | "open";

export type TopicId =
  | "about"
  | "contact"
  | "locations"
  | "payments"
  | "discounts"
  | "gift_cards"
  | "loyalty"
  | "hot_updates"
  | "customization"
  | "shipping"
  | "international"
  | "pickup"
  | "tracking"
  | "lead_time"
  | "courier"
  | "stock"
  | "order"
  | "invoices"
  | "defects"
  | "returns"
  | "exchanges"
  | "refunds"
  | "cancellations"
  | "warranty"
  | "process_shipping"
  | "process_return"
  | "process_exchange"
  | "process_refund"
  | "process_cancel"
  | "process_defect"
  | "integrations"
  | "product_info"
  | "product_edit";

export type TopicStatus = "conflict" | "clear" | "unclear" | "missing";

export type ClaimDecision = "pending" | "approved" | "rejected";

export type ClaimSource = {
  url: string;
  pageTitle: string;
  path: string;
  excerpt?: string;
};

export type ExtractedClaim = {
  id: string;
  topicId: TopicId;
  text: string;
  sources: ClaimSource[];
};

export type TopicReview = {
  id: TopicId;
  group: TopicGroupId;
  groupTitle: string;
  groupTitleHe: string;
  title: string;
  titleHe: string;
  status: TopicStatus;
  recommendation: string;
  recommendationHe: string;
  suggestedPath: string;
  exampleCanonical: string;
  exampleCanonicalHe: string;
  writeChecklist: string[];
  writeChecklistHe: string[];
  aiWhy: string;
  aiWhyHe: string;
  claims: ExtractedClaim[];
  matchedPages: ClaimSource[];
};

export type ScanResult = {
  storeUrl: string;
  storeName: string;
  scannedAt: string;
  pagesScanned: { url: string; title: string; path: string }[];
  topics: TopicReview[];
  demo?: boolean;
  importedKb?: boolean;
};

export type TopicDecisionState = {
  claimDecisions: Record<string, ClaimDecision>;
  canonicalText: string;
  notRelevant?: boolean;
  qaAnswers?: Record<string, string>;
  qaSkip?: Record<string, boolean>;
  qaCollect?: Record<string, string[]>;
};

export type CustomQaItem = {
  id: string;
  groupId: TopicGroupId;
  section: "info" | "process";
  question: string;
  answer: string;
  skipped?: boolean;
  collectFields?: string[];
  detailName?: string;
  forCustomers?: boolean;
  suggestedAnswer?: string;
  verdict?: ClaimDecision;
};

export type ProductReviewState = {
  skipped?: boolean;
  editFields?: string[];
  notes?: string;
};

export type ReviewState = {
  storeUrl: string;
  decisions: Partial<Record<TopicId, TopicDecisionState>>;
  customQas?: CustomQaItem[];
  productReviews?: Record<string, ProductReviewState>;
};
