import type { ClarityLang } from "./copy";
import { COLLECT_FIELDS } from "./collect-fields";

export type ChipSetId = "collect" | "couriers" | "platforms" | "product_info" | "product_edit";

export type ChipItem = {
  id: string;
  he: string;
  en: string;
  keywords?: RegExp;
};

export const COURIER_CHIPS: ChipItem[] = [
  { id: "orian", he: "אוריין", en: "Orian", keywords: /orian|אוריין/i },
  { id: "hfd", he: "HFD", en: "HFD", keywords: /\bhfd\b/i },
  { id: "israel_post", he: "דואר ישראל", en: "Israel Post", keywords: /דואר\s*ישראל|israel post|go\s*post/i },
  { id: "ups", he: "UPS", en: "UPS", keywords: /\bups\b/i },
  { id: "dhl", he: "DHL", en: "DHL", keywords: /\bdhl\b/i },
  { id: "fedex", he: "FedEx", en: "FedEx", keywords: /fedex/i },
  { id: "cheetah", he: "צ׳יטה", en: "Cheetah", keywords: /cheetah|צ['׳]יטה/i },
  { id: "logisteam", he: "לוגיסטים", en: "Logisteam", keywords: /logisteam|לוגיסט/i },
  { id: "boxit", he: "בוקסיט", en: "Boxit", keywords: /boxit|בוקסיט/i },
  { id: "pickup_point", he: "נקודות חלוקה", en: "Pickup points", keywords: /נקודות\s*חלוקה|pickup point|locker/i },
  { id: "self", he: "שליח עצמי", en: "Own courier", keywords: /שליח\s*עצמי|own (?:driver|courier)/i },
];

export const PLATFORM_CHIPS: ChipItem[] = [
  { id: "shopify", he: "Shopify", en: "Shopify", keywords: /shopify|myshopify/i },
  { id: "woocommerce", he: "WooCommerce", en: "WooCommerce", keywords: /woocommerce|וורדפרס/i },
  { id: "wix", he: "Wix", en: "Wix", keywords: /\bwix\b/i },
  { id: "magento", he: "Magento", en: "Magento", keywords: /magento/i },
  { id: "google", he: "Google / Merchant", en: "Google Merchant", keywords: /google\s*(?:shopping|merchant)|merchant center/i },
  { id: "meta", he: "Facebook / Instagram", en: "Meta", keywords: /facebook|instagram|meta\s*ads/i },
  { id: "whatsapp", he: "WhatsApp Business", en: "WhatsApp", keywords: /whatsapp|וואטסאפ/i },
  { id: "klaviyo", he: "Klaviyo", en: "Klaviyo", keywords: /klaviyo/i },
  { id: "mailchimp", he: "Mailchimp", en: "Mailchimp", keywords: /mailchimp/i },
  { id: "paypal", he: "PayPal", en: "PayPal", keywords: /paypal/i },
  { id: "bit", he: "ביט", en: "Bit", keywords: /(?<![א-ת])ביט(?![א-ת])|\bbit\b/i },
  { id: "grow", he: "Grow", en: "Grow", keywords: /\bgrow\b/i },
  { id: "tranzila", he: "Tranzila", en: "Tranzila", keywords: /tranzila|טרנזילה/i },
  { id: "payplus", he: "PayPlus", en: "PayPlus", keywords: /payplus/i },
  { id: "erp", he: "ERP / Priority", en: "ERP", keywords: /priority|erp|חשבשבת/i },
];

export const PRODUCT_INFO_CHIPS: ChipItem[] = [
  { id: "materials", he: "חומרים", en: "Materials" },
  { id: "sizes", he: "מידות", en: "Sizes" },
  { id: "colors", he: "צבעים", en: "Colors" },
  { id: "care", he: "הוראות טיפול", en: "Care" },
  { id: "origin", he: "ארץ ייצור", en: "Origin" },
  { id: "warranty_on_pdp", he: "אחריות בתיאור", en: "Warranty on PDP" },
  { id: "shipping_on_pdp", he: "משלוח בתיאור", en: "Shipping on PDP" },
  { id: "returns_on_pdp", he: "החזרות בתיאור", en: "Returns on PDP" },
  { id: "sku", he: "מק״ט / SKU", en: "SKU" },
  { id: "weight", he: "משקל", en: "Weight" },
  { id: "compatibility", he: "התאמה / דגמים", en: "Compatibility" },
];

export const PRODUCT_EDIT_CHIPS: ChipItem[] = [
  { id: "title", he: "כותרת", en: "Title" },
  { id: "description", he: "תיאור", en: "Description" },
  { id: "images", he: "תמונות", en: "Images" },
  { id: "price", he: "מחיר", en: "Price" },
  { id: "remove_policy", he: "להוריד מדיניות מהתיאור", en: "Remove policy text" },
  { id: "sizes_table", he: "טבלת מידות", en: "Size chart" },
  { id: "materials", he: "חומרים", en: "Materials" },
  { id: "variants", he: "ווריאציות", en: "Variants" },
  { id: "seo", he: "SEO", en: "SEO" },
  { id: "tags", he: "תגיות", en: "Tags" },
];

export const CHIP_SETS: Record<ChipSetId, ChipItem[]> = {
  collect: COLLECT_FIELDS,
  couriers: COURIER_CHIPS,
  platforms: PLATFORM_CHIPS,
  product_info: PRODUCT_INFO_CHIPS,
  product_edit: PRODUCT_EDIT_CHIPS,
};

const CHIP_HINT: Record<ChipSetId, { he: string; en: string }> = {
  collect: { he: "לחצו על סוגי המידע שצריך לאסוף מהלקוח", en: "Tap what you need to collect from the customer" },
  couriers: { he: "לחצו על חברות המשלוחים שעובדים איתן", en: "Tap the shipping companies you use" },
  platforms: { he: "לחצו על הפלטפורמות שיש אינטגרציה אליהן", en: "Tap the platforms you integrate with" },
  product_info: { he: "לחצו על סוגי המידע שרלוונטיים במוצרים", en: "Tap the product info that is relevant" },
  product_edit: { he: "לחצו על מה צריך לערוך במוצרים", en: "Tap what should be edited on products" },
};

const CHIP_PREFIX: Record<ChipSetId, { he: string; en: string }> = {
  collect: { he: "לאסוף מהלקוח", en: "Collect from customer" },
  couriers: { he: "חברות משלוחים", en: "Shipping companies" },
  platforms: { he: "אינטגרציות", en: "Integrations" },
  product_info: { he: "מידע רלוונטי במוצרים", en: "Relevant product info" },
  product_edit: { he: "מה לערוך במוצרים", en: "Edit on products" },
};

export function qaChipSet(def: { collect?: boolean; chipSet?: ChipSetId }): ChipSetId | null {
  if (def.chipSet) return def.chipSet;
  if (def.collect) return "collect";
  return null;
}

export function chipHint(set: ChipSetId, lang: ClarityLang) {
  return lang === "he" ? CHIP_HINT[set].he : CHIP_HINT[set].en;
}

export function chipLabel(set: ChipSetId, id: string, lang: ClarityLang) {
  if (id.startsWith("custom:")) return id.slice(7);
  const item = CHIP_SETS[set].find((field) => field.id === id);
  if (!item) return id;
  return lang === "he" ? item.he : item.en;
}

export function detectChipIds(set: ChipSetId, text: string) {
  if (!text.trim()) return [];
  return CHIP_SETS[set]
    .filter((item) => item.keywords?.test(text))
    .map((item) => item.id);
}

export function formatChipLine(set: ChipSetId | null | undefined, ids: string[], lang: ClarityLang) {
  if (!set || ids.length === 0) return "";
  const labels = ids.map((id) => chipLabel(set, id, lang)).filter(Boolean);
  if (labels.length === 0) return "";
  const prefix = lang === "he" ? CHIP_PREFIX[set].he : CHIP_PREFIX[set].en;
  return `${prefix}: ${labels.join(" · ")}`;
}
