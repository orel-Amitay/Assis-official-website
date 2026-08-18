import type { ChipSetId } from "./chips";
import { claimsConflict } from "./extract";
import type { ClarityLang } from "./copy";
import type { ClaimDecision, ExtractedClaim, ReviewState, TopicId, TopicReview } from "./types";

export type QaDef = {
  id: string;
  topicId: TopicId;
  en: string;
  he: string;
  keywords: RegExp;
  alwaysShow?: boolean;
  placeholderEn?: string;
  placeholderHe?: string;
  collect?: boolean;
  chipSet?: ChipSetId;
};

export const QA_DEFS: QaDef[] = [
  {
    id: "about.who",
    topicId: "about",
    en: "Who are you? What is the company?",
    he: "מי אתם? מה החברה?",
    keywords: /who we are|about us|our company|מי אנחנו|אודות|החברה שלנו/i,
    placeholderEn: "Who you are, what you sell, who it’s for.",
    placeholderHe: "מי אתם, מה המוצרים, למי זה מיועד.",
  },
  {
    id: "about.story",
    topicId: "about",
    en: "What’s the company story / bio?",
    he: "מה הסיפור של החברה? מה הביו?",
    keywords: /our story|founded|since \d{4}|הסיפור|הוקמ|נוסד|ביוגרפ|מאז|התחל/i,
    placeholderEn: "When you started, who founded it, how it began.",
    placeholderHe: "מתי הוקמתם, מי היזמים, איך הכל התחיל.",
  },
  {
    id: "about.why",
    topicId: "about",
    en: "Why this brand - what makes you different?",
    he: "למה דווקא אתם? מה מייחד אתכם?",
    keywords: /why us|what makes us|unique|mission|חזון|ייעוד|למה אנחנו|למה דווקא|שונה|מיוחד/i,
    placeholderEn: "Why choose you - values, quality, story.",
    placeholderHe: "למה לבחור בכם ולא במתחרים - ערכים, איכות, סיפור.",
  },
  { id: "contact.hours", topicId: "contact", en: "What are the human support hours on WhatsApp?", he: "מה שעות פעילות מענה אנושי בוואטסאפ?", keywords: /hours|שעות|ימים\s*א|sunday|thursday|א['׳]?\s*[-–]\s*ה|09:00|16:00/i },
  { id: "contact.channel", topicId: "contact", en: "How do I contact you? Is there email?", he: "איך יוצרים קשר? יש מייל?", keywords: /whatsapp|וואטסאפ|email|מייל|phone|טלפון|chat|צ׳אט|צור\s*קשר|054/i },
  { id: "contact.response", topicId: "contact", en: "How quickly do you reply?", he: "תוך כמה זמן חוזרים אליי?", keywords: /response|מענה|חוזרים|minutes|דקות/i },
  { id: "locations.address", topicId: "locations", en: "Where is the showroom? Can I come and see?", he: "איפה חנות התצוגה? אפשר לבוא לראות?", keywords: /address|כתובת|showroom|סניפ|אולם|visit us|o2o|וייז|waze|בית\s*שמש|אודם/i },
  { id: "locations.hours", topicId: "locations", en: "What are the showroom hours?", he: "מה שעות פעילות חנות התצוגה?", keywords: /showroom hours|שעות.*תצוגה|friday|שישי|10:00|בתיאום\s*מראש/i },
  { id: "locations.buy", topicId: "locations", en: "Can I buy and pick up from the store?", he: "אפשר לקנות ולאסוף מהחנות?", keywords: /buy in (?:the )?store|רכישה\s*בחנות|איסוף\s*מהחנות/i },
  { id: "payments.fighter", topicId: "payments", en: "Do you accept Fighter cards?", he: "מקבלים כרטיס אשראי פייטר?", keywords: /fighter|פייטר/i },
  { id: "payments.methods", topicId: "payments", en: "What payment methods do you accept?", he: "באילו אמצעי תשלום אפשר לשלם?", keywords: /visa|\bbit\b|paypal|apple pay|אשראי|(?<![א-ת])ביט(?![א-ת])|payment|דיירקט|buyme/i },
  { id: "payments.vat", topicId: "payments", en: "Do prices include VAT?", he: "המחירים כוללים מע״מ?", keywords: /vat|מע["״]מ|include/i },
  { id: "payments.installments", topicId: "payments", en: "Can I pay in installments?", he: "אפשר לשלם בתשלומים?", keywords: /installment|תשלומים|klarna|ללא\s*ריבית/i },
  { id: "gift_cards.sell", topicId: "gift_cards", en: "Do you sell gift cards?", he: "יש גיפט קארד באתר?", keywords: /gift card|גיפט|שובר\s*מתנה|כרטיס\s*מתנה/i },
  { id: "stock.status", topicId: "stock", en: "What happens if something is out of stock?", he: "מה קורה אם מוצר אזל מהמלאי?", keywords: /out of stock|אזל|מלאי|sold out/i },
  { id: "stock.alert", topicId: "stock", en: "Can I get a restock alert?", he: "אפשר לקבל עדכון חזרה למלאי?", keywords: /back in stock|עדכן\s*ברגע|restock|חזרה\s*למלאי|יחזור\s*למלאי/i },
  { id: "stock.preorder", topicId: "stock", en: "What is a preorder?", he: "מה זה הזמנה מוקדמת / Preorder?", keywords: /pre[- ]?order|preorder|הזמנה\s*מוקדמת/i },
  { id: "order.change", topicId: "order", en: "Can I change or merge an order?", he: "אפשר לשנות או לאחד הזמנה?", keywords: /change order|merge|שינוי\s*הזמנה|איחוד\s*הזמנות/i },
  { id: "order.phone", topicId: "order", en: "Can I order by phone?", he: "אפשר להזמין בטלפון?", keywords: /phone order|הזמנה\s*טלפונית/i },
  { id: "discounts.how", topicId: "discounts", en: "How do discount codes work?", he: "איך עובדים קופונים והנחות?", keywords: /coupon|promo|קוד\s*הנחה|קופון|הנחה/i },
  { id: "discounts.stack", topicId: "discounts", en: "Can coupon codes be combined?", he: "אפשר כפל קודי קופון?", keywords: /stack|כפל|one code|קוד\s*אחד|לא\s*ניתן\s*לשלב/i },
  { id: "discounts.exclude", topicId: "discounts", en: "What is excluded from discounts?", he: "על מה ההנחה לא חלה?", keywords: /exclude|סייל|sale items|לא חל/i },
  { id: "discounts.influencer", topicId: "discounts", en: "Do influencer coupon codes work?", he: "יש קודי קופון של משפיעניות?", keywords: /influencer|משפיענ|קוד\s*קופון\s*פעיל/i },
  { id: "loyalty.join", topicId: "loyalty", en: "Is there a loyalty club?", he: "יש מועדון לקוחות?", keywords: /loyalty|club|מועדון|vip|mra\s*club/i },
  { id: "loyalty.points", topicId: "loyalty", en: "How do I earn and redeem points?", he: "איך צוברים ומממשים נקודות?", keywords: /points|נקודות|redeem|מממש|5\s*%|5\s*אחוז/i },
  { id: "hot_updates.now", topicId: "hot_updates", en: "Is there an important update right now?", he: "יש עדכון חשוב עכשיו?", keywords: /update|התייקרות|עדכון|temporary|המחירים יעודכנו|מהרו להזמין|פלסטיק/i },
  { id: "hot_updates.supplier", topicId: "hot_updates", en: "Are you an approved defense-ministry supplier?", he: "אתם ספק מאושר משרד הביטחון?", keywords: /defense|משרד\s*הביטחון|ספק\s*מאושר|מאמני\s*ירי/i },
  { id: "customization.how", topicId: "customization", en: "How do custom orders work?", he: "איך מזמינים בהתאמה אישית?", keywords: /custom|התאמה|personalized|מידות\s*גוף|נרתיק|בלי לצאת מהבית/i },
  { id: "customization.need", topicId: "customization", en: "What do I need to send for a custom order?", he: "מה צריך לשלוח להזמנה בהתאמה?", keywords: /photos|תמונות|model|דגם|measure|מידה/i },
  { id: "customization.made", topicId: "customization", en: "Is it made in Israel?", he: "הייצור כחול לבן?", keywords: /made in israel|כחול\s*לבן|ייצור\s*מקומי/i },
  { id: "shipping.time", topicId: "shipping", en: "How long does shipping / delivery take?", he: "כמה זמן לוקח המשלוח/אספקה?", keywords: /business days|ימי\s*עסק|תוך|delivery|מגיע|arrives|shipping takes|עד\s*\d+\s*ימ/i },
  { id: "shipping.cost", topicId: "shipping", en: "How much does shipping cost?", he: "כמה עולה לי המשלוח?", keywords: /shipping fee|דמי\s*משלוח|cost|עולה|flat rate|פחות מ-?\s*10|עד הבית|שקל/i },
  { id: "shipping.free", topicId: "shipping", en: "When is shipping free?", he: "מתי המשלוח חינם?", keywords: /free shipping|משלוח\s*חינם|חינם מעל|free over|נקודות\s*חלוקה/i },
  { id: "shipping.delay", topicId: "shipping", en: "What if the shipment is delayed?", he: "במידה והמשלוח מתעכב, מה עושים?", keywords: /delay|עיכוב|מתעכב/i },
  {
    id: "courier.who",
    topicId: "courier",
    en: "Which shipping company do you use?",
    he: "עם איזו חברת משלוחים עובדים?",
    keywords: /courier|חברת\s*משלוח|אוריין|orian|logisteam|לוגיסט|hfd|dhl|ups|דואר/i,
    alwaysShow: true,
    chipSet: "couriers",
    placeholderEn: "Orian / HFD / Israel Post - tap below, or write extra details.",
    placeholderHe: "אוריין / HFD / דואר ישראל - לחצו למטה, או כתבו פרטים נוספים.",
  },
  { id: "courier.schedule", topicId: "courier", en: "How do I schedule receiving the delivery?", he: "איך מתאמים הגעה לקבלת המשלוח?", keywords: /sms|סמס|schedule|תיאום|חלון\s*זמנים|ייצור\s*קשר/i },
  { id: "international.yes", topicId: "international", en: "Do you ship internationally?", he: "יש משלוחים לחו״ל?", keywords: /international|worldwide|חו["״]ל|abroad/i },
  { id: "international.customs", topicId: "international", en: "Who pays customs fees?", he: "מי משלם מכס?", keywords: /customs|מכס/i },
  { id: "pickup.available", topicId: "pickup", en: "Is self-pickup available?", he: "יש איסוף עצמי?", keywords: /pickup|איסוף\s*עצמי|click\s*&\s*collect|מרלו|נקודות\s*חלוקה/i },
  { id: "pickup.where", topicId: "pickup", en: "Where do I pick up, and when is it ready?", he: "מאיפה אוספים ומתי זה מוכן?", keywords: /ready|מוכן|location|מיקום|studio|סטודיו|תעודה\s*מזהה/i },
  { id: "tracking.how", topicId: "tracking", en: "If a customer asks about order / shipping status", he: "אם לקוח שואל על סטטוס משלוח/הזמנה", keywords: /track|מעקב|tracking|סטטוס\s*(?:משלוח|הזמנה)/i, collect: true },
  { id: "lead_time.custom", topicId: "lead_time", en: "How long does production take?", he: "כמה זמן לוקח הייצור?", keywords: /production|ייצור|lead time|מוכן תוך|10\s*שעות/i },
  { id: "lead_time.stock", topicId: "lead_time", en: "How fast do in-stock items ship?", he: "פריט במלאי - תוך כמה זמן יוצא?", keywords: /in[- ]?stock|מלאי|processing/i },
  { id: "returns.window", topicId: "returns", en: "How many trial / return days are there?", he: "תוך כמה זמן אפשר להחזיר? יש תקופת ניסיון?", keywords: /14|30|100|days|יום|ימים|trial|ניסיון|return window|תוך/i },
  { id: "returns.who_pays", topicId: "returns", en: "Who pays for return shipping?", he: "מי משלם על משלוח ההחזרה?", keywords: /return shipping|משלוח\s*החזרה|customer pays|הלקוח משלם|איסוף\s*עד\s*הבית/i },
  { id: "returns.conditions", topicId: "returns", en: "What are the return conditions?", he: "מה התנאים להחזרה?", keywords: /unused|לא בשימוש|defective|פגום|sale items|סייל|אריזה/i },
  { id: "exchanges.allowed", topicId: "exchanges", en: "Can I exchange a product?", he: "אפשר להחליף מוצר?", keywords: /exchange|החלפ|size|מידה/i },
  { id: "exchanges.how", topicId: "exchanges", en: "How does an exchange work?", he: "איך עובד תהליך ההחלפה?", keywords: /send|נשלח|process|תהליך|after the original|קוד\s*קופון/i },
  { id: "refunds.method", topicId: "refunds", en: "How do refunds / store credit work?", he: "איך מקבלים החזר כספי / זיכוי?", keywords: /refund|החזר\s*כספ|store credit|זיכוי|original payment|דיירקט/i },
  { id: "refunds.time", topicId: "refunds", en: "How long until the money is returned?", he: "תוך כמה ימים הכסף חוזר?", keywords: /10|14|business days|ימי\s*עסק|within/i },
  { id: "cancellations.until", topicId: "cancellations", en: "Until when can I cancel an order?", he: "עד מתי אפשר לבטל הזמנה?", keywords: /cancel|ביטול|until they ship|עד שהיא יוצאת|ביטולי\s*עסקאות/i },
  { id: "warranty.length", topicId: "warranty", en: "Is there a warranty, and for how long?", he: "יש אחריות? לכמה זמן?", keywords: /warranty|אחריות|12|10\s*שנ|month|חודש|שנה|חמש\s*שנים|קליפס/i },
  { id: "warranty.cover", topicId: "warranty", en: "What does the warranty cover / not cover?", he: "מה האחריות כוללת ומה לא?", keywords: /wear|בלאי|not covered|אינו כלול|defects|פגם\s*ייצור|כתמים|מבחן\s*כשלים/i },
  { id: "defects.how", topicId: "defects", en: "The item arrived damaged. What should I do?", he: "במקרה של פגם - מה עושים?", keywords: /defect|פגם|פגום|damaged|תמונה|סרטון|photo|video/i },
  { id: "invoices.when", topicId: "invoices", en: "I didn’t get an invoice - what now?", he: "בקשה לשליחת חשבונית / לא קיבלתי חשבונית", keywords: /invoice|חשבונית|receipt|קבלה|ספאם|spam/i },
  {
    id: "process_shipping.steps",
    topicId: "process_shipping",
    en: "What is the shipping / delivery process, step by step?",
    he: "מה תהליך המשלוח/אספקה? שלב אחרי שלב",
    keywords: /תהליך\s*משלוח|shipping process|delivery process/i,
    alwaysShow: true,
    placeholderEn: "1) Order confirmed. 2) Packed and handed to courier. 3) Tracking SMS/email. 4) Home delivery or pickup point.",
    placeholderHe: "1) ההזמנה מאושרת. 2) אריזה ומסירה לשליח. 3) מעקב בסמס/מייל. 4) עד הבית או נקודת חלוקה.",
  },
  {
    id: "process_shipping.collect",
    topicId: "process_shipping",
    en: "What do we collect when a customer asks about shipping / order status?",
    he: "מה לאסוף מהלקוח כשהוא שואל על משלוח/סטטוס הזמנה?",
    keywords: /סטטוס\s*(?:משלוח|הזמנה)|tracking|מספר הזמנה/i,
    alwaysShow: true,
    placeholderEn: "Full name, order number or phone, shipping address, when they ordered.",
    placeholderHe: "שם מלא, מספר הזמנה או טלפון, כתובת למשלוח, מתי הוזמן.",
    collect: true,
  },
  {
    id: "process_shipping.delay",
    topicId: "process_shipping",
    en: "What is the process if a shipment is delayed?",
    he: "מה התהליך אם המשלוח מתעכב?",
    keywords: /עיכוב|delay|מתעכב/i,
    alwaysShow: true,
    placeholderEn: "1) Take order number. 2) Check with courier. 3) Update the customer. 4) If lost - replacement or refund.",
    placeholderHe: "1) מספר הזמנה. 2) בדיקה מול חברת המשלוחים. 3) עדכון ללקוח. 4) אם אבד - החלפה או החזר.",
  },
  {
    id: "process_return.steps",
    topicId: "process_return",
    en: "What is the return process, step by step?",
    he: "מה תהליך ההחזרה? שלב אחרי שלב",
    keywords: /תהליך\s*החזר|how to return|return process|שלב/i,
    alwaysShow: true,
    placeholderEn: "1) Customer contacts WhatsApp. 2) Check eligibility. 3) Arrange pickup or they ship it. 4) After arrival - refund.",
    placeholderHe: "1) הלקוח פונה בוואטסאפ. 2) בודקים זכאות. 3) מתאמים איסוף או שהלקוח שולח. 4) אחרי קבלה - החזר כספי.",
  },
  {
    id: "process_return.collect_start",
    topicId: "process_return",
    en: "What do we collect from the customer to start a return?",
    he: "מה לאסוף מהלקוח כדי להתחיל החזרה?",
    keywords: /מספר הזמנה|order number|כתובת לאיסוף|סיבת ההחזר/i,
    alwaysShow: true,
    placeholderEn: "Full name, order number or phone, which item, reason, used/opened?, pickup address.",
    placeholderHe: "שם מלא, מספר הזמנה או טלפון, איזה מוצר, סיבת ההחזרה, האם נפתח/בשימוש, כתובת לאיסוף.",
    collect: true,
  },
  {
    id: "process_return.collect_done",
    topicId: "process_return",
    en: "What do we need to complete the return?",
    he: "מה צריך כדי להשלים החזרה?",
    keywords: /התקבל|אושר|החזר כספי אחרי/i,
    alwaysShow: true,
    placeholderEn: "Confirmation the item arrived, condition, approve refund or store credit.",
    placeholderHe: "אישור שהמוצר הגיע, מצב המוצר, האם לאשר החזר כספי או זיכוי.",
    collect: true,
  },
  {
    id: "process_exchange.steps",
    topicId: "process_exchange",
    en: "What is the exchange process, step by step?",
    he: "מה תהליך ההחלפה? שלב אחרי שלב",
    keywords: /תהליך\s*החלפ|how to exchange|exchange process/i,
    alwaysShow: true,
    placeholderEn: "1) WhatsApp with order + new size/model. 2) Confirm stock. 3) Return original. 4) Send replacement or coupon.",
    placeholderHe: "1) וואטסאפ עם הזמנה + מידה/דגם חדש. 2) בודקים מלאי. 3) מחזירים את המקורי. 4) שולחים חלופי או קוד קופון.",
  },
  {
    id: "process_exchange.collect_start",
    topicId: "process_exchange",
    en: "What do we collect from the customer to start an exchange?",
    he: "מה לאסוף מהלקוח כדי להתחיל החלפה?",
    keywords: /מידה חדשה|דגם חדש|new size|new model/i,
    alwaysShow: true,
    placeholderEn: "Order number, current item, requested size/model/color, why, photos if needed.",
    placeholderHe: "מספר הזמנה, המוצר הנוכחי, מידה/דגם/צבע מבוקש, סיבה, תמונות אם צריך.",
    collect: true,
  },
  {
    id: "process_exchange.collect_done",
    topicId: "process_exchange",
    en: "What do we need to complete the exchange?",
    he: "מה צריך כדי להשלים החלפה?",
    keywords: /קוד קופון|replacement sent|החלופי/i,
    alwaysShow: true,
    placeholderEn: "Original received, new item in stock / coupon issued, shipping address for the replacement.",
    placeholderHe: "המקורי התקבל, יש מלאי לחלופי / הונפק קופון, כתובת למשלוח החלופי.",
    collect: true,
  },
  {
    id: "process_refund.steps",
    topicId: "process_refund",
    en: "What is the refund / store-credit process?",
    he: "מה תהליך הזיכוי / החזר כספי?",
    keywords: /תהליך\s*(?:החזר כספ|זיכוי)|refund process/i,
    alwaysShow: true,
    placeholderEn: "After the item is approved: refund to original method within X business days, or store credit if requested.",
    placeholderHe: "אחרי שהמוצר אושר: החזר לאמצעי המקורי תוך X ימי עסקים, או זיכוי אם הלקוח ביקש.",
  },
  {
    id: "process_refund.collect_start",
    topicId: "process_refund",
    en: "What do we collect from the customer to start a refund?",
    he: "מה לאסוף מהלקוח כדי להתחיל זיכוי/החזר?",
    keywords: /4 ספרות|last 4|אמצעי תשלום|פייטר/i,
    alwaysShow: true,
    placeholderEn: "Order number, payment method (Fighter/Visa/etc.), last 4 digits, refund vs store credit.",
    placeholderHe: "מספר הזמנה, אמצעי תשלום (פייטר/אשראי וכו'), 4 ספרות אחרונות, החזר או זיכוי.",
    collect: true,
  },
  {
    id: "process_refund.collect_done",
    topicId: "process_refund",
    en: "What do we need to complete the refund?",
    he: "מה צריך כדי להשלים זיכוי/החזר?",
    keywords: /אושר להחזר|refund approved|זיכוי בוצע/i,
    alwaysShow: true,
    placeholderEn: "Item received and approved, amount, date the refund was sent, confirmation to the customer.",
    placeholderHe: "המוצר התקבל ואושר, סכום, תאריך ביצוע ההחזר, אישור ללקוח.",
    collect: true,
  },
  {
    id: "process_cancel.steps",
    topicId: "process_cancel",
    en: "What is the cancellation process?",
    he: "מה תהליך ביטול הזמנה?",
    keywords: /תהליך\s*ביטול|how to cancel|cancel process/i,
    alwaysShow: true,
    placeholderEn: "1) Get the order number. 2) If not shipped / production not started - cancel. 3) If shipped - return process.",
    placeholderHe: "1) מקבלים מספר הזמנה. 2) אם לא יצאה / לא התחיל ייצור - מבטלים. 3) אם יצאה - תהליך החזרה.",
  },
  {
    id: "process_cancel.collect_start",
    topicId: "process_cancel",
    en: "What do we collect from the customer to start a cancellation?",
    he: "מה לאסוף מהלקוח כדי להתחיל ביטול?",
    keywords: /לבטל|סיבת הביטול|cancel reason/i,
    alwaysShow: true,
    placeholderEn: "Order number or phone, reason, has it shipped / has production started?",
    placeholderHe: "מספר הזמנה או טלפון, סיבה, האם כבר יצאה / האם הייצור התחיל?",
    collect: true,
  },
  {
    id: "process_defect.steps",
    topicId: "process_defect",
    en: "What is the defect / warranty claim process?",
    he: "מה תהליך הטיפול בפגם / אחריות?",
    keywords: /תהליך.*פגם|warranty claim|תמונה וסרטון/i,
    alwaysShow: true,
    placeholderEn: "1) Photo + video on WhatsApp. 2) We review. 3) Repair, replace, or refund.",
    placeholderHe: "1) תמונה + סרטון בוואטסאפ. 2) בודקים. 3) תיקון, החלפה או החזר.",
  },
  {
    id: "process_defect.collect_start",
    topicId: "process_defect",
    en: "What do we collect from the customer to open a defect claim?",
    he: "מה לאסוף מהלקוח כדי לפתוח תקלת פגם?",
    keywords: /שלחו תמונה|photo|video|סרטון|מתי הגיע/i,
    alwaysShow: true,
    placeholderEn: "Order number, item, when it arrived, clear photo, short video, description of the issue.",
    placeholderHe: "מספר הזמנה, המוצר, מתי הגיע, תמונה ברורה, סרטון קצר, תיאור התקלה.",
    collect: true,
  },
  {
    id: "integrations.which",
    topicId: "integrations",
    en: "Which platforms / integrations does the store use?",
    he: "לאילו פלטפורמות יש אינטגרציה?",
    keywords: /shopify|woocommerce|wix|klaviyo|paypal|whatsapp|אינטגרצ/i,
    alwaysShow: true,
    chipSet: "platforms",
    placeholderEn: "Tap Shopify, WhatsApp, Google… or write another integration.",
    placeholderHe: "לחצו Shopify, וואטסאפ, Google… או כתבו אינטגרציה נוספת.",
  },
  {
    id: "product_info.which",
    topicId: "product_info",
    en: "What product information is relevant for customers / agents?",
    he: "איזה מידע על מוצרים רלוונטי ללקוחות / לסוכן?",
    keywords: /materials|חומר|מידות|sizes|care|הוראות\s*טיפול/i,
    alwaysShow: true,
    chipSet: "product_info",
    placeholderEn: "Tap what’s relevant: materials, sizes, care… then write anything extra.",
    placeholderHe: "לחצו מה רלוונטי: חומרים, מידות, טיפול… ואז כתבו אם צריך.",
  },
  {
    id: "product_edit.which",
    topicId: "product_edit",
    en: "What should be edited on product pages?",
    he: "מה צריך לערוך בעמודי המוצרים?",
    keywords: /product description|תיאור\s*מוצר|size chart|טבלת\s*מידות/i,
    alwaysShow: true,
    chipSet: "product_edit",
    placeholderEn: "Tap what to edit: title, description, remove policy text…",
    placeholderHe: "לחצו מה לערוך: כותרת, תיאור, להוריד מדיניות מהתיאור…",
  },
];

const BY_TOPIC = new Map<TopicId, QaDef[]>();
for (const def of QA_DEFS) {
  const list = BY_TOPIC.get(def.topicId) || [];
  list.push(def);
  BY_TOPIC.set(def.topicId, list);
}

export function questionsForTopic(topicId: TopicId) {
  return BY_TOPIC.get(topicId) || [];
}

export function questionLabel(def: QaDef, lang: ClarityLang) {
  return lang === "he" ? def.he : def.en;
}

export function assignQa(topicId: TopicId, text: string) {
  const defs = questionsForTopic(topicId);
  if (defs.length === 0) return `${topicId}.main`;
  let best = defs[0].id;
  let score = -1;
  for (const def of defs) {
    const match = text.match(def.keywords);
    const hit = match ? match[0].length : 0;
    if (hit > score) {
      score = hit;
      best = def.id;
    }
  }
  return best;
}

export type QaBlock = {
  def: QaDef;
  claims: ExtractedClaim[];
  answer: string;
  question: string;
  conflict: boolean;
  skipped: boolean;
  collectFields: string[];
  decisions: Record<string, ClaimDecision>;
};

export function qaBlocks(topic: TopicReview, state?: ReviewState | null): QaBlock[] {
  const defs = questionsForTopic(topic.id);
  if (defs.length === 0) return [];
  const topicState = state?.decisions[topic.id];
  const buckets = new Map<string, ExtractedClaim[]>();
  for (const def of defs) buckets.set(def.id, []);
  for (const claim of topic.claims) {
    const id = assignQa(topic.id, claim.text);
    const list = buckets.get(id) || buckets.get(defs[0].id) || [];
    list.push(claim);
    buckets.set(id, list);
  }

  return defs
    .map((def) => {
      const claims = buckets.get(def.id) || [];
      const skipped = Boolean(topicState?.qaSkip?.[def.id] || topicState?.notRelevant);
      const answer = topicState?.qaAnswers?.[def.id] || "";
      const question = topicState?.qaQuestions?.[def.id] || "";
      const collectFields = topicState?.qaCollect?.[def.id] || [];
      const decisions = topicState?.claimDecisions || {};
      const conflict =
        claims.length >= 2 &&
        claims.some((a, i) => claims.slice(i + 1).some((b) => claimsConflict(a, b)));
      const resolved = Boolean(answer.trim()) || claims.some((claim) => decisions[claim.id] === "approved");
      return {
        def,
        claims,
        answer,
        question,
        conflict: conflict && !resolved,
        skipped,
        collectFields,
        decisions,
      };
    })
    .filter((block) => block.claims.length > 0 || block.answer || block.def.alwaysShow);
}

export function qaBlockDone(block: QaBlock) {
  if (block.skipped) return true;
  return Object.values(block.decisions).some((decision) => decision === "approved");
}

export function qaPlaceholder(def: QaDef, lang: ClarityLang) {
  return lang === "he" ? def.placeholderHe || "" : def.placeholderEn || "";
}

export function visibleQaBlocks(resultTopics: TopicReview[], state?: ReviewState | null) {
  return resultTopics.flatMap((topic) => qaBlocks(topic, state).filter((block) => !block.skipped));
}
