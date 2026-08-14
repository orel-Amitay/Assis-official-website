import type { ClarityLang } from "./copy";

export type CollectField = {
  id: string;
  he: string;
  en: string;
  keywords: RegExp;
};

export const COLLECT_FIELDS: CollectField[] = [
  { id: "customer_name", he: "שם לקוח", en: "Customer name", keywords: /שם\s*(?:מלא|הלקוח|הלקוחה)|full name|customer name/i },
  { id: "first_name", he: "שם פרטי", en: "First name", keywords: /שם\s*פרטי|first name/i },
  { id: "last_name", he: "שם משפחה", en: "Last name", keywords: /שם\s*משפחה|last name/i },
  { id: "phone", he: "טלפון", en: "Phone", keywords: /טלפון|מספר\s*נייד|phone number/i },
  { id: "email", he: "מייל", en: "Email", keywords: /מייל|אימייל|e-?mail/i },
  { id: "order_number", he: "מספר הזמנה", en: "Order number", keywords: /מספר\s*הזמנה|order\s*(?:number|#|id)/i },
  { id: "tracking_number", he: "מספר משלוח / מעקב", en: "Tracking number", keywords: /מספר\s*(?:משלוח|מעקב)|tracking\s*(?:number|id|code)/i },
  { id: "id_number", he: "תעודת זהות", en: "ID number", keywords: /תעודת\s*זהות|ת\.?\s*ז\.?|national id/i },
  { id: "credit_last4", he: "4 ספרות אחרונות", en: "Last 4 digits", keywords: /4\s*ספרות\s*אחרונות|last\s*4/i },
  { id: "credit_card", he: "פרטי אשראי", en: "Card details", keywords: /פרטי\s*אשראי|credit card details/i },
  { id: "payment_method", he: "אמצעי תשלום", en: "Payment method", keywords: /אמצעי\s*תשלום|payment method/i },
  { id: "shipping_address", he: "כתובת למשלוח", en: "Shipping address", keywords: /כתובת\s*(?:למשלוח|משלוח)|shipping address/i },
  { id: "pickup_address", he: "כתובת לאיסוף", en: "Pickup address", keywords: /כתובת\s*לאיסוף|pickup address/i },
  { id: "item", he: "שם המוצר", en: "Item", keywords: /שם\s*המוצר|איזה\s*מוצר|which item/i },
  { id: "size", he: "מידה", en: "Size", keywords: /מידה(?:\s*חדשה)?|new size/i },
  { id: "color", he: "צבע", en: "Color", keywords: /צבע|color/i },
  { id: "model", he: "דגם", en: "Model", keywords: /דגם|model/i },
  { id: "reason", he: "סיבה", en: "Reason", keywords: /סיב(?:ה|ת)|reason/i },
  { id: "photos", he: "תמונות", en: "Photos", keywords: /תמונ(?:ה|ות)|photos?/i },
  { id: "video", he: "סרטון", en: "Video", keywords: /סרטון|video/i },
  { id: "arrival_date", he: "תאריך הגעה", en: "Arrival date", keywords: /מתי\s*הגיע|תאריך\s*הגעה|arrival date/i },
  { id: "order_date", he: "תאריך הזמנה", en: "Order date", keywords: /מתי\s*הוזמן|תאריך\s*הזמנה|order date/i },
  { id: "opened", he: "האם נפתח / בשימוש", en: "Opened / used?", keywords: /נפתח|בשימוש|unused|opened/i },
  { id: "refund_or_credit", he: "החזר או זיכוי", en: "Refund or credit", keywords: /החזר\s*או\s*זיכוי|refund or (?:store )?credit/i },
  { id: "shipped_yet", he: "האם כבר יצאה", en: "Already shipped?", keywords: /האם\s*(?:כבר\s*)?(?:יצאה|נשלחה)|has it shipped|production started/i },
];

export function collectFieldLabel(id: string, lang: ClarityLang) {
  if (id.startsWith("custom:")) return id.slice(7);
  const field = COLLECT_FIELDS.find((item) => item.id === id);
  if (!field) return id;
  return lang === "he" ? field.he : field.en;
}

export function detectCollectFieldIds(text: string) {
  if (!text.trim()) return [];
  return COLLECT_FIELDS.filter((field) => field.keywords.test(text)).map((field) => field.id);
}

export function formatCollectLine(ids: string[], lang: ClarityLang) {
  if (ids.length === 0) return "";
  const labels = ids.map((id) => collectFieldLabel(id, lang)).filter(Boolean);
  if (labels.length === 0) return "";
  return lang === "he" ? `לאסוף מהלקוח: ${labels.join(" · ")}` : `Collect from customer: ${labels.join(" · ")}`;
}

export function toggleCollectId(current: string[] | undefined, id: string) {
  const list = current || [];
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}
