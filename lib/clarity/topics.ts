import type { TopicGroupId, TopicId, TopicStatus } from "./types";

export type TopicDef = {
  id: TopicId;
  group: TopicGroupId;
  title: string;
  titleHe: string;
  keywords: RegExp;
  pathHints: RegExp;
  suggestedPath: string;
  exampleCanonical: string;
  exampleCanonicalHe: string;
  missingEn: string;
  missingHe: string;
};

export const GROUPS: { id: TopicGroupId; title: string; titleHe: string }[] = [
  { id: "site_qa", title: "Site Q&A", titleHe: "שאלות תשובות - מהאתר" },
  { id: "general", title: "General info", titleHe: "מידע כללי" },
  { id: "delivery", title: "Shipping", titleHe: "משלוחים" },
  { id: "returns", title: "Returns & exchanges", titleHe: "החלפות החזרות" },
  { id: "warranty", title: "Defects & warranty", titleHe: "פגמים/אחריות" },
  { id: "promos", title: "Promos & discounts", titleHe: "מבצעים הנחות והטבות" },
  { id: "products", title: "More product info", titleHe: "מידע נוסף - מוצרים" },
  { id: "prebuy", title: "Before purchase", titleHe: "לפני רכישה/מכירה" },
  { id: "influencers", title: "Influencers & coupon codes", titleHe: "משפיעניות וקודי קופון" },
  { id: "notes", title: "Important notes", titleHe: "דגשים חשובים" },
  { id: "service", title: "Support hours", titleHe: "שעות פעילות מענה שירות לקוחות וואטסאפ" },
  { id: "billing", title: "Invoices", titleHe: "חשבוניות" },
  { id: "integrations", title: "Platforms & integrations", titleHe: "פלטפורמות ואינטגרציות" },
  { id: "open", title: "Open questions", titleHe: "שאלות פתוחות" },
];

export const TOPICS: TopicDef[] = [
  {
    id: "about",
    group: "general",
    title: "About",
    titleHe: "אודות",
    keywords:
      /\b(about us|our story|who we are|founded in|est\.|since \d{4}|our mission|our vision|family[- ]owned|we started|why we (?:exist|started|do)|brand story)\b|אודות|הסיפור(?:\s*שלנו)?|מי אנחנו|הוקמ(?:ה|נו)?|נוסד(?:ה)?|החזון|הייעוד|למה אנחנו|למה דווקא|מותג(?:\s+ה)?משפח|עסק משפחתי|מאז\s+\d{4}/i,
    pathHints: /about|our[-_]?story|who[-_]?we[-_]?are|אודות|הסיפור/i,
    suggestedPath: "/pages/about",
    exampleCanonical:
      "We are [brand], a [category] company founded in [year]. Our story: [short bio]. Customers choose us because [why this brand].",
    exampleCanonicalHe:
      "אנחנו [שם], מותג [קטגוריה] שהוקם ב-[שנה]. הסיפור שלנו: [ביו קצר]. לקוחות בוחרים בנו כי [למה דווקא אתם].",
    missingEn: "Write who you are, the company story, why you exist, and what happened before — the bio.",
    missingHe: "כתבו מי אתם, מה הסיפור של החברה, למה דווקא אתם, ומה הביו — איך הכל התחיל.",
  },
  {
    id: "contact",
    group: "service",
    title: "Contact & hours",
    titleHe: "יצירת קשר ושעות",
    keywords:
      /\b(opening hours|business hours|customer service|support hours|whatsapp|call us|email us)\b|שעות\s*פעילות|מוקד|שירות\s*לקוחות|וואטסאפ|whatsapp|ימים\s*א['׳]?\s*[-–]\s*ה/i,
    pathHints: /contact|customer-service|support|צור[-_]?קשר|שירות[-_]?לקוחות/i,
    suggestedPath: "/pages/contact",
    exampleCanonical: "Customer service is available Sunday–Thursday, 9:00–17:00, by WhatsApp, email, and the site chat.",
    exampleCanonicalHe: "שירות לקוחות זמין בימים א׳–ה׳, 9:00–17:00, בוואטסאפ, במייל ובצ׳אט באתר.",
    missingEn: "Write when you’re available and on which channels. Suggested: “Sunday–Thursday 9:00–17:00, WhatsApp / email / chat.”",
    missingHe: "כתבו מתי אתם זמינים ובאילו ערוצים. נוסח מוצע: “א׳–ה׳ 9:00–17:00, וואטסאפ / מייל / צ׳אט.”",
  },
  {
    id: "locations",
    group: "general",
    title: "Store & pickup",
    titleHe: "חנות ואיסוף",
    keywords:
      /\b(our stores?|store locator|visit us|showroom|retail location|branch(?:es)?|by appointment)\b|סניפ(?:ים)?|כתובת(?:\s*החנות)?|אולם\s*תצוגה|בתיאום\s*מראש|וייז|waze/i,
    pathHints: /stores?|locations?|showroom|סניפ|כתובת|pickup-point/i,
    suggestedPath: "/pages/stores",
    exampleCanonical: "Our showroom is at [address]. Open [days/hours]. Pickup is available from this location.",
    exampleCanonicalHe: "אולם התצוגה ב-[כתובת]. פתוח ב-[ימים/שעות]. ניתן לאסוף הזמנות מהמקום.",
    missingEn: "If you have a physical store or pickup point, add the address and hours. If not, write: “We are online-only; no walk-in store.”",
    missingHe: "אם יש סניף או נקודת איסוף — כתבו כתובת ושעות. אם לא: “החנות אונליין בלבד, אין סניף לקבלת קהל.”",
  },
  {
    id: "payments",
    group: "general",
    title: "Payment methods",
    titleHe: "אמצעי תשלום",
    keywords:
      /\b(visa|mastercard|amex|paypal|apple pay|google pay|bit\b|klarna|shop pay|credit card|debit card|payment methods?|fighter)\b|אשראי|(?<![א-ת])ביט(?![א-ת])|פייטר|ישראכרט|כאל|תשלומים|אמצעי\s*תשלום|פייפאל/i,
    pathHints: /payment|checkout|תשלום|אמצעי[-_]?תשלום/i,
    suggestedPath: "/pages/payment",
    exampleCanonical: "We accept Visa, Mastercard, Apple Pay, Google Pay, and Bit. Prices include VAT.",
    exampleCanonicalHe: "ניתן לשלם באשראי, ביט וכרטיס פייטר. המחירים כוללים מע״מ.",
    missingEn: "List every payment method clearly, including Fighter, Bit, or installments if you offer them.",
    missingHe: "רשמו בבירור את כל אמצעי התשלום, כולל פייטר, ביט או תשלומים אם רלוונטי.",
  },
  {
    id: "discounts",
    group: "promos",
    title: "Discounts & codes",
    titleHe: "הנחות וקופונים",
    keywords:
      /\b(coupon|promo code|discount code|voucher|sale code|% off)\b|קופון|קוד\s*הנחה|מבצע|הנחה/i,
    pathHints: /discount|promo|coupon|sale|הנחות|קופון|מבצעים/i,
    suggestedPath: "/pages/promotions",
    exampleCanonical: "Discount codes can be entered at checkout. Sale items may be excluded. One code per order.",
    exampleCanonicalHe: "ניתן להזין קוד הנחה בקופה. פריטי סייל עשויים להיות ללא הנחה נוספת. קוד אחד להזמנה.",
    missingEn: "Explain how codes work: where to enter them, what they don’t apply to, and whether they stack.",
    missingHe: "הסבירו איך קופונים עובדים: איפה מזינים, על מה לא חל, והאם אפשר לשלב.",
  },
  {
    id: "gift_cards",
    group: "promos",
    title: "Gift cards",
    titleHe: "גיפט קארד",
    keywords: /\b(gift cards?|e[- ]?gift)\b|גיפט\s*קארד|תו\s*שי|שובר\s*מתנה/i,
    pathHints: /gift[-_]?card|גיפט|שובר[-_]?מתנה/i,
    suggestedPath: "/products/gift-card",
    exampleCanonical: "Gift cards are sold on the site, never expire, and can be used on any full-price item.",
    exampleCanonicalHe: "גיפט קארד נמכר באתר, ללא תוקף, וניתן למימוש על כל פריט במחיר מלא.",
    missingEn: "If you sell gift cards, say where to buy them, whether they expire, and what they can’t be used on.",
    missingHe: "אם יש גיפט קארד — איפה קונים, האם יש תוקף, ועל מה אי אפשר לממש.",
  },
  {
    id: "loyalty",
    group: "promos",
    title: "Loyalty / club",
    titleHe: "מועדון לקוחות",
    keywords:
      /\b(loyalty|rewards? program|members? club|vip)\b|מועדון\s*לקוחות|חבר\s*מועדון|נקודות\s*מועדון|mra\s*club|הצטרפו למועדון/i,
    pathHints: /loyalty|rewards|club|vip|מועדון/i,
    suggestedPath: "/pages/club",
    exampleCanonical: "Club members earn points on every order and redeem them at checkout. Sign up is free.",
    exampleCanonicalHe: "חברי מועדון צוברים נקודות בכל הזמנה ומממשים בקופה. ההצטרפות חינם.",
    missingEn: "If you have a club, explain how to join, how points are earned, and how they’re redeemed. If not, skip this.",
    missingHe: "אם יש מועדון — איך מצטרפים, איך צוברים, ואיך מממשים. אם אין, אפשר להשאיר ריק.",
  },
  {
    id: "hot_updates",
    group: "notes",
    title: "Current notices",
    titleHe: "עדכונים חמים",
    keywords:
      /\b(price(?:s)? (?:will )?increase|temporary|until supplies last)\b|המחירים יעודכנו|מהרו להזמין|הטבת השקה|עדכון מחיר|התייקרות|ספק\s*(?:מאושר\s*)?משרד\s*הביטחון|מאמני\s*ירי/i,
    pathHints: /notice|update|announcement|עדכון/i,
    suggestedPath: "/pages/updates",
    exampleCanonical: "No temporary updates right now. Site prices and policies are current.",
    exampleCanonicalHe: "אין עדכון זמני כרגע. המחירים והמדיניות באתר מעודכנים.",
    missingEn: "Write any live warning (price change, delay). If none: “No temporary updates.”",
    missingHe: "כתבו אזהרה פעילה (התייקרות, עיכוב). אם אין: “אין עדכון זמני.”",
  },
  {
    id: "customization",
    group: "site_qa",
    title: "Custom orders",
    titleHe: "התאמה אישית",
    keywords:
      /\b(custom fit|made to measure|personalized|custom order|without leaving home)\b|בהתאמה אישית|התאמה אישית|מידות גוף|לפי הגוף|בלי לצאת מהבית|נרתיק(?:ים)?\s+בהתאמה/i,
    pathHints: /custom|personaliz|התאמה[-_]?אישית/i,
    suggestedPath: "/pages/custom",
    exampleCanonical: "Custom orders start on WhatsApp: model + photos → we confirm fit → production begins after approval.",
    exampleCanonicalHe: "הזמנה בהתאמה מתחילה בוואטסאפ: דגם + תמונות → מאשרים התאמה → הייצור מתחיל אחרי אישור.",
    missingEn: "Write the exact custom flow. This is often the whole business.",
    missingHe: "כתבו את תהליך ההתאמה בדיוק. לעיתים זה כל העסק.",
  },
  {
    id: "shipping",
    group: "delivery",
    title: "Shipping (domestic)",
    titleHe: "משלוחים בארץ",
    keywords:
      /\b(shipping|shipment|delivery|courier|freight|business days|working days|shipping fee|flat rate)\b|משלוח|משלוחים|שליח(?!ה)|ימי\s*עסק(?:ים)?|דמי\s*משלוח|דואר|חברת\s*שילוח/i,
    pathHints: /shipping|delivery|משלוח|שילוח/i,
    suggestedPath: "/policies/shipping-policy",
    exampleCanonical: "Standard shipping in Israel arrives within 3–14 business days. Free over ₪X.",
    exampleCanonicalHe: "משלוח רגיל בישראל מגיע תוך 3–14 ימי עסקים. חינם מעל ₪X.",
    missingEn: "This page is essential. Write one clear domestic window, the cost, and when shipping is free.",
    missingHe: "זה עמוד חובה. כתבו חלון זמן אחד ברור למשלוח בארץ, את המחיר, וממתי המשלוח חינם.",
  },
  {
    id: "international",
    group: "delivery",
    title: "International shipping",
    titleHe: "משלוחים לחו״ל",
    keywords:
      /\b(international shipping|worldwide|ship(?:s|ping)? (?:abroad|overseas|worldwide|to (?:the )?(?:us|usa|uk|eu|europe))|customs)\b|משלוח\s*לחו["״]?ל|לארה["״]?ב|בינלאומ|שילוח\s*עולמי/i,
    pathHints: /international|worldwide|global-shipping|חו["״]?ל|בינלאומ/i,
    suggestedPath: "/policies/shipping-policy",
    exampleCanonical: "We ship internationally. Delivery usually takes X–Y business days. Customs fees are paid by the customer.",
    exampleCanonicalHe: "יש משלוחים לחו״ל. זמן אספקה בדרך כלל X–Y ימי עסקים. מיסי מכס על הלקוח.",
    missingEn: "Say whether you ship abroad, to which countries, how long it takes, and who pays customs.",
    missingHe: "כתבו אם יש משלוח לחו״ל, לאילו מדינות, כמה זמן, ומי משלם מכס.",
  },
  {
    id: "pickup",
    group: "delivery",
    title: "Self-pickup",
    titleHe: "איסוף עצמי",
    keywords:
      /\b(self[- ]?pickup|click\s*&\s*collect|collect in store|store pickup|pick up in store|pickup point|locker)\b|איסוף\s*עצמי|איסוף\s*מהחנות|נקודות?\s*חלוקה|סניפי\s*דואר|משלוח\s*חינם\s*לנקודות/i,
    pathHints: /pickup|collect|איסוף/i,
    suggestedPath: "/pages/pickup",
    exampleCanonical: "Self-pickup is free from [location]. Orders are ready within X business days. Bring ID.",
    exampleCanonicalHe: "איסוף עצמי חינם מ-[מיקום]. ההזמנה מוכנה תוך X ימי עסקים. יש להביא תעודה מזהה.",
    missingEn: "If pickup exists, write where, when it’s ready, and whether it’s free. If not: “We don’t offer self-pickup.”",
    missingHe: "אם יש איסוף עצמי — איפה, מתי מוכן, והאם חינם. אם אין: “אין איסוף עצמי.”",
  },
  {
    id: "tracking",
    group: "delivery",
    title: "Order tracking",
    titleHe: "מעקב הזמנה",
    keywords:
      /\b(track(?:ing)? (?:your )?order|tracking (?:number|link|code)|shipment status|order status)\b|מעקב\s*הזמנה|מספר\s*מעקב|סטטוס\s*משלוח|לינק\s*מעקב/i,
    pathHints: /tracking|order-status|מעקב/i,
    suggestedPath: "/pages/order-tracking",
    exampleCanonical: "A tracking link is emailed when the order ships. You can also check status with your order number.",
    exampleCanonicalHe: "לינק מעקב נשלח במייל כשההזמנה יוצאת. אפשר גם לבדוק סטטוס עם מספר ההזמנה.",
    missingEn: "Explain how customers track an order: email link, WhatsApp, or order number.",
    missingHe: "הסבירו איך עוקבים אחרי הזמנה: לינק במייל, וואטסאפ, או מספר הזמנה.",
  },
  {
    id: "lead_time",
    group: "delivery",
    title: "Production time",
    titleHe: "זמן ייצור",
    keywords:
      /\b(lead time|production time|made to order|ready within|processing time)\b|זמן\s*י[צץ]ור|ימי\s*ייצור|מוכן תוך|הזמנה\s*מותאמת|10\s*שעות/i,
    pathHints: /lead[-_]?time|production|ייצור|זמן[-_]?אספקה/i,
    suggestedPath: "/pages/production",
    exampleCanonical: "Custom items are produced within X hours/days after approval. In-stock items ship within Y business days.",
    exampleCanonicalHe: "פריט בהתאמה מיוצר תוך X שעות/ימים אחרי אישור. פריט במלאי יוצא תוך Y ימי עסקים.",
    missingEn: "Split production time from shipping time. Custom vs in-stock must be two different sentences.",
    missingHe: "הפרידו זמן ייצור מזמן משלוח. התאמה אישית ומלאי — שני משפטים שונים.",
  },
  {
    id: "returns",
    group: "returns",
    title: "Returns",
    titleHe: "החזרות",
    keywords:
      /\b(returns?|returning|send it back|return window|return policy|restocking)\b|החזרה|החזרות|להחזיר\s*מוצר|מדיניות\s*החזר/i,
    pathHints: /returns?|החזר/i,
    suggestedPath: "/policies/refund-policy",
    exampleCanonical: "Unused items can be returned within 14 days of delivery. The customer pays return shipping unless the item is defective.",
    exampleCanonicalHe: "ניתן להחזיר פריטים שלא בשימוש תוך 14 יום מקבלת המשלוח. הלקוח משלם על משלוח החזרה, אלא אם הפריט פגום.",
    missingEn: "This page is essential. One number, one condition: how many days, from when, and who pays return shipping.",
    missingHe: "זה עמוד חובה. מספר אחד ותנאי אחד: כמה ימים, מאיזה רגע, ומי משלם על משלוח ההחזרה.",
  },
  {
    id: "exchanges",
    group: "returns",
    title: "Exchanges",
    titleHe: "החלפות",
    keywords: /\b(exchanges?|exchange policy|swap)\b|החלפה|החלפות|להחליף\s*מידה|החלפת\s*מוצר/i,
    pathHints: /exchange|החלפ/i,
    suggestedPath: "/pages/exchanges",
    exampleCanonical: "Size exchanges are available within 14 days. We’ll send a new item after the original is received.",
    exampleCanonicalHe: "ניתן להחליף מידה תוך 14 יום. פריט חדש נשלח אחרי קבלת המקורי.",
    missingEn: "Say whether exchanges are allowed, for size/color only, and how the process works.",
    missingHe: "כתבו אם יש החלפות, רק מידה/צבע, ואיך התהליך עובד.",
  },
  {
    id: "refunds",
    group: "returns",
    title: "Refunds",
    titleHe: "החזרי כספים",
    keywords:
      /\b(refunds?|money back|store credit|reimbursed?)\b|החזר\s*כספי|החזר\s*כסף|זיכוי|כסף\s*חזרה|החזרים/i,
    pathHints: /refund|החזר[-_]?כספ|זיכוי/i,
    suggestedPath: "/policies/refund-policy",
    exampleCanonical: "Approved returns are refunded to the original payment method within 10 business days. No store credit unless requested.",
    exampleCanonicalHe: "החזר מאושר חוזר לאמצעי התשלום המקורי תוך 10 ימי עסקים. אין זיכוי אלא אם הלקוח ביקש.",
    missingEn: "Choose one rule: full refund to the original method, or store credit — and how many days it takes.",
    missingHe: "בחרו כלל אחד: החזר מלא לאמצעי המקורי, או זיכוי — ותוך כמה ימים.",
  },
  {
    id: "cancellations",
    group: "returns",
    title: "Cancellations",
    titleHe: "ביטול הזמנה",
    keywords:
      /\b(cancel(?:ling|lation)? (?:an? )?order|order cancel)\b|ביטול\s*הזמנה|לבטל\s*הזמנה/i,
    pathHints: /cancel|ביטול/i,
    suggestedPath: "/pages/cancellations",
    exampleCanonical: "Orders can be cancelled until they ship. After shipping, use the return process.",
    exampleCanonicalHe: "ניתן לבטל הזמנה עד שהיא יוצאת למשלוח. אחרי השילוח — דרך תהליך ההחזרה.",
    missingEn: "Write the cutoff: can they cancel before shipping? After that, returns only.",
    missingHe: "כתבו עד מתי אפשר לבטל. אחרי יציאה למשלוח — רק החזרה.",
  },
  {
    id: "warranty",
    group: "warranty",
    title: "Warranty",
    titleHe: "אחריות",
    keywords: /\b(warrant(?:y|ies)|guarantee|guaranteed)\b|אחריות|ערבות/i,
    pathHints: /warranty|guarantee|אחריות/i,
    suggestedPath: "/pages/warranty",
    exampleCanonical: "Products include a 12-month warranty against manufacturing defects. Wear and tear is not covered.",
    exampleCanonicalHe: "למוצרים אחריות 12 חודשים על פגם ייצור. בלאי רגיל אינו כלול.",
    missingEn: "If you offer warranty, say for how long and what it covers. If not: “No additional warranty beyond consumer law.”",
    missingHe: "אם יש אחריות — לכמה זמן ועל מה. אם אין: “אין אחריות מעבר לחוק הגנת הצרכן.”",
  },
  {
    id: "courier",
    group: "delivery",
    title: "Courier & delivery scheduling",
    titleHe: "חברת משלוחים ותיאום",
    keywords:
      /\b(courier|shipping company|sms|schedule delivery|delivery window|orian|hfd|dhl|ups|fedex)\b|חברת\s*משלוח(?:ים)?|תיאום\s*(?:הגעה|אספקה)|אוריין|שליח\s*יצור\s*קשר|חלון\s*זמנים|דואר\s*ישראל|צ['׳]יטה/i,
    pathHints: /shipping|delivery|courier|משלוח/i,
    suggestedPath: "/policies/shipping-policy",
    exampleCanonical: "When the order is handed to the courier, you get an SMS to schedule delivery.",
    exampleCanonicalHe: "כשההזמנה עוברת לחברת המשלוחים נשלח סמס לתיאום הגעה.",
    missingEn: "Name the courier and how delivery is scheduled (SMS, call, leave at door).",
    missingHe: "כתבו עם איזו חברת משלוחים עובדים ואיך מתאמים הגעה (סמס, שיחה, השארה בדלת).",
  },
  {
    id: "stock",
    group: "prebuy",
    title: "Stock & preorder",
    titleHe: "מלאי והזמנה מוקדמת",
    keywords:
      /\b(out of stock|back in stock|pre[- ]?order|preorder|sold out)\b|אזל(?:\s*מהמלאי)?|חזרה\s*למלאי|הזמנה\s*מוקדמת|preorder|עדכן\s*ברגע\s*שזמין/i,
    pathHints: /stock|preorder|הזמנה[-_]?מוקדמת|מלאי/i,
    suggestedPath: "/pages/faq",
    exampleCanonical: "If an item is out of stock, restock dates are updated on the product page. Preorder items ship later than regular stock.",
    exampleCanonicalHe: "אם מוצר אזל מהמלאי, צפי חזרה מתעדכן בעמוד המוצר. הזמנה מוקדמת מגיעה מאוחר יותר ממלאי רגיל.",
    missingEn: "Explain out-of-stock, restock alerts, and what preorder means for delivery time.",
    missingHe: "הסבירו מה קורה כשאזל מלאי, איך נרשמים לעדכון, ומה המשמעות של הזמנה מוקדמת לזמן אספקה.",
  },
  {
    id: "order",
    group: "prebuy",
    title: "Order changes",
    titleHe: "הזמנה ושינויים",
    keywords:
      /\b(change (?:an? )?order|combine orders|edit order|phone order)\b|שינוי\s*הזמנה|איחוד\s*הזמנות|הזמנה\s*טלפונית|לא\s*ניתן\s*לשנות/i,
    pathHints: /order|הזמנה|faq/i,
    suggestedPath: "/pages/faq",
    exampleCanonical: "Orders can’t be merged or edited after checkout. Cancel before shipping and place a new order.",
    exampleCanonicalHe: "אין איחוד הזמנות ואין שינוי אחרי תשלום. אפשר לבטל לפני משלוח ולבצע הזמנה חדשה.",
    missingEn: "Can they change address, merge orders, or order by phone?",
    missingHe: "אפשר לשנות כתובת, לאחד הזמנות, או להזמין בטלפון?",
  },
  {
    id: "invoices",
    group: "billing",
    title: "Invoices",
    titleHe: "חשבוניות",
    keywords:
      /\b(invoice|tax invoice|receipt)\b|חשבונית|קבלה|לא\s*קיבלתי\s*חשבונית/i,
    pathHints: /invoice|receipt|חשבונית|קבלה/i,
    suggestedPath: "/pages/faq",
    exampleCanonical: "The invoice is emailed automatically after delivery, to the address used at checkout. Check spam if it’s missing.",
    exampleCanonicalHe: "החשבונית נשלחת אוטומטית למייל שהוזן בהזמנה, אחרי קבלת המשלוח. אם לא הגיעה — בדקו בספאם.",
    missingEn: "When is the invoice sent, to which email, and what to do if it didn’t arrive?",
    missingHe: "מתי נשלחת חשבונית, לאיזה מייל, ומה עושים אם לא הגיעה?",
  },
  {
    id: "defects",
    group: "warranty",
    title: "Defects",
    titleHe: "במקרה של פגם",
    keywords:
      /\b(defect(?:ive)?|damaged on arrival|manufacturing defect)\b|פגם(?:\s*ייצור)?|פגום|הגיע\s*שבור|תמונה\s*וסרטון/i,
    pathHints: /warranty|defect|פגם|אחריות/i,
    suggestedPath: "/pages/warranty",
    exampleCanonical: "If an item arrives damaged, send a clear photo and video on WhatsApp so we can review it.",
    exampleCanonicalHe: "אם המוצר הגיע פגום, שלחו תמונה וסרטון ברורים בוואטסאפ לבדיקה.",
    missingEn: "What should a customer send if something is defective, and what happens next?",
    missingHe: "מה הלקוח צריך לשלוח במקרה של פגם, ומה קורה אחר כך?",
  },
  {
    id: "process_shipping",
    group: "delivery",
    title: "Shipping process",
    titleHe: "תהליך משלוח",
    keywords:
      /\b(shipping process|how (?:do )?you ship|delivery process|order confirmed|handed to (?:the )?courier|tracking (?:sms|email|number|link))\b|תהליך\s*משלוח|איך\s*שולחים|סטטוס\s*(?:משלוח|הזמנה)|מעקב\s*(?:משלוח|הזמנה)|מספר\s*(?:מעקב|משלוח)|נמסר\s*לשליח|יצאה\s*למשלוח|ההזמנה\s*(?:מאושרת|נשלחה)|תיאום\s*משלוח/i,
    pathHints: /shipping|delivery|משלוח|faq/i,
    suggestedPath: "/policies/shipping-policy",
    exampleCanonical:
      "1) Order is confirmed. 2) Packed and handed to the courier. 3) Customer gets a tracking SMS/email. 4) Delivery or pickup point.",
    exampleCanonicalHe:
      "1) ההזמנה מאושרת. 2) אריזה ומסירה לחברת המשלוחים. 3) הלקוח מקבל מעקב בסמס/מייל. 4) משלוח עד הבית או נקודת חלוקה.",
    missingEn: "Write the shipping steps, and what to collect when a customer asks about an order.",
    missingHe: "כתבו את שלבי המשלוח, ומה לאסוף כשלקוח שואל על הזמנה.",
  },
  {
    id: "process_return",
    group: "returns",
    title: "Return process",
    titleHe: "תהליך החזרה",
    keywords:
      /\b(return process|how to return|start a return|return request|return form|send it back)\b|תהליך\s*החזר|איך\s*(?:מחזיר|להחזיר)|כדי להתחיל.*החזר|פנייה\s*(?:להחזר|להחזרה)|טופס\s*החזר|ליצור\s*קשר.*החזר|וואטסאפ.*החזר|צרו\s*קשר.*(?:להחזיר|החזר)|שלחו.*(?:החזר|החזרה)|איסוף\s*(?:ההחזרה|המוצר)|להחזיר\s*את\s*המוצר/i,
    pathHints: /returns?|החזר|faq/i,
    suggestedPath: "/pages/returns",
    exampleCanonical:
      "1) Customer contacts WhatsApp. 2) We check eligibility. 3) We arrange pickup or they ship it back. 4) After we receive it, we issue the refund.",
    exampleCanonicalHe:
      "1) הלקוח פונה בוואטסאפ. 2) בודקים זכאות. 3) מתאמים איסוף או שהלקוח שולח. 4) אחרי קבלה — ממשיכים להחזר כספי.",
    missingEn: "Write the return steps, and exactly what to collect from the customer to start and finish.",
    missingHe: "כתבו את שלבי ההחזרה, ומה בדיוק לאסוף מהלקוח כדי להתחיל ולסיים.",
  },
  {
    id: "process_exchange",
    group: "returns",
    title: "Exchange process",
    titleHe: "תהליך החלפה",
    keywords:
      /\b(exchange process|how to exchange|swap process|new size|replacement)\b|תהליך\s*החלפ|איך\s*(?:מחליף|להחליף)|קוד\s*קופון.*החלפ|מידה\s*חדשה|דגם\s*חדש|מחליפים\s*מוצר/i,
    pathHints: /exchange|החלפ|faq/i,
    suggestedPath: "/pages/exchanges",
    exampleCanonical:
      "1) Customer contacts WhatsApp with the order and the new size/model. 2) We confirm stock. 3) They return the original. 4) We send the replacement or issue a coupon code.",
    exampleCanonicalHe:
      "1) הלקוח פונה בוואטסאפ עם ההזמנה והמידה/דגם החדש. 2) בודקים מלאי. 3) מחזירים את המקורי. 4) שולחים חלופי או מנפיקים קוד קופון.",
    missingEn: "Write the exchange steps and what to collect before starting.",
    missingHe: "כתבו את שלבי ההחלפה ומה לאסוף לפני שמתחילים.",
  },
  {
    id: "process_refund",
    group: "returns",
    title: "Refund / credit process",
    titleHe: "תהליך זיכוי / החזר כספי",
    keywords:
      /\b(refund process|store credit process|last 4 digits|original payment)\b|תהליך\s*(?:החזר כספ|זיכוי)|איך מקבלים החזר|מתי מזכים|4\s*ספרות|אמצעי\s*התשלום\s*המקורי/i,
    pathHints: /refund|זיכוי|החזר[-_]?כספ|faq/i,
    suggestedPath: "/policies/refund-policy",
    exampleCanonical:
      "After the item is received and approved: refund to the original payment method within X business days. Ask for order number, last 4 digits of the card, and whether they want refund or store credit.",
    exampleCanonicalHe:
      "אחרי שהמוצר התקבל ואושר: החזר לאמצעי המקורי תוך X ימי עסקים. לאסוף מספר הזמנה, 4 ספרות אחרונות של הכרטיס, והאם רוצים החזר או זיכוי.",
    missingEn: "Write when the refund starts, to which method, and what details you need from the customer.",
    missingHe: "כתבו מתי מתחיל הזיכוי, לאיזה אמצעי, ואילו פרטים צריך מהלקוח.",
  },
  {
    id: "process_cancel",
    group: "returns",
    title: "Cancellation process",
    titleHe: "תהליך ביטול הזמנה",
    keywords:
      /\b(cancel(?:lation)? process|how to cancel|cancel before shipping)\b|תהליך\s*ביטול|איך מבטל|לבטל הזמנה|ביטול\s*לפני\s*משלוח|טרם\s*(?:יצאה|נשלחה)/i,
    pathHints: /cancel|ביטול|faq/i,
    suggestedPath: "/pages/cancellations",
    exampleCanonical:
      "1) Customer sends order number on WhatsApp. 2) If it hasn’t shipped / production hasn’t started — cancel. 3) If it already shipped — use the return process.",
    exampleCanonicalHe:
      "1) הלקוח שולח מספר הזמנה בוואטסאפ. 2) אם עוד לא יצאה / לא התחיל ייצור — מבטלים. 3) אם כבר יצאה — עוברים לתהליך החזרה.",
    missingEn: "Write the cancellation steps and what to collect (order number, reason, before/after shipping).",
    missingHe: "כתבו את שלבי הביטול ומה לאסוף (מספר הזמנה, סיבה, לפני/אחרי משלוח).",
  },
  {
    id: "process_defect",
    group: "warranty",
    title: "Defect claim process",
    titleHe: "תהליך פגם / אחריות",
    keywords:
      /\b(warranty claim|open a claim|photo and video|send (?:a )?photo)\b|תהליך.*פגם|תמונה וסרטון|שלחו תמונה|פתיחת תקלה|תקלת\s*פגם|תיעוד\s*הפגם/i,
    pathHints: /warranty|defect|פגם|אחריות|faq/i,
    suggestedPath: "/pages/warranty",
    exampleCanonical:
      "1) Customer sends clear photo + video on WhatsApp. 2) Include order number and when it arrived. 3) We review. 4) Repair, replace, or refund.",
    exampleCanonicalHe:
      "1) הלקוח שולח תמונה וסרטון ברורים בוואטסאפ. 2) מספר הזמנה ומתי הגיע. 3) בודקים. 4) תיקון, החלפה או החזר.",
    missingEn: "Write the defect steps and the exact files/details to collect before opening a claim.",
    missingHe: "כתבו את שלבי הטיפול בפגם, ואילו קבצים/פרטים לאסוף לפני שפותחים תקלה.",
  },
  {
    id: "integrations",
    group: "integrations",
    title: "Platforms & integrations",
    titleHe: "פלטפורמות ואינטגרציות",
    keywords:
      /\b(shopify|woocommerce|wix|magento|klaviyo|mailchimp|google merchant|facebook shop|instagram shop|payplus|tranzila)\b|אינטגרצ|פלטפורמ/i,
    pathHints: /apps|integrations?|shopify|woocommerce/i,
    suggestedPath: "/pages/faq",
    exampleCanonical: "The store runs on Shopify and is connected to WhatsApp Business, Google Merchant, and Bit.",
    exampleCanonicalHe: "החנות רצה על Shopify ומחוברת לוואטסאפ ביזנס, Google Merchant וביט.",
    missingEn: "Mark which platforms you integrate with.",
    missingHe: "סמנו לאילו פלטפורמות יש אינטגרציה.",
  },
  {
    id: "product_info",
    group: "products",
    title: "Relevant product information",
    titleHe: "מידע רלוונטי על מוצרים",
    keywords:
      /\b(materials?|fabric|size chart|care instructions|made in|sku)\b|חומרים|טבלת\s*מידות|הוראות\s*טיפול|מק["״]ט/i,
    pathHints: /products?|collections?/i,
    suggestedPath: "/collections/all",
    exampleCanonical: "Product pages should include materials, sizes, and care. Shipping/returns belong on the info page, not on every product.",
    exampleCanonicalHe: "בעמודי מוצר צריכים להיות חומרים, מידות והוראות טיפול. משלוחים והחזרות שייכים לדף המידע, לא לכל מוצר.",
    missingEn: "Mark which product facts are relevant for customers and agents.",
    missingHe: "סמנו איזה מידע על מוצרים רלוונטי ללקוחות ולסוכן.",
  },
  {
    id: "product_edit",
    group: "products",
    title: "What to edit on products",
    titleHe: "מה לערוך במוצרים",
    keywords:
      /\b(product description|edit title|size chart|seo title)\b|תיאור\s*מוצר|לערוך\s*מוצר/i,
    pathHints: /products?/i,
    suggestedPath: "/collections/all",
    exampleCanonical: "Remove policy sentences from descriptions. Keep materials, sizes, and photos. Fix titles where needed.",
    exampleCanonicalHe: "להוריד משפטי מדיניות מהתיאורים. להשאיר חומרים, מידות ותמונות. לתקן כותרות איפה שצריך.",
    missingEn: "Mark what should be edited on product pages.",
    missingHe: "סמנו מה צריך לערוך בעמודי המוצרים.",
  },
];

export const POLICY_PATH_HINT =
  /shipping|delivery|returns?|refund|exchange|faq|policy|policies|warranty|contact|about|help|משלוח|החזר|החלפ|שאלות|מדיניות|אחריות|צור[-_]?קשר|pickup|tracking|gift|loyalty|rewards|payment|cancel|terms|stores?|locations?|סניפ|איסוף|מעקב|קופון|תקנון|אודות|about-us|our-story|customer-service|contact-us|promotions?|club|showroom|ביטול|התאמה|ייצור|פייטר|custom/i;

export const SKIP_PATH =
  /\/(cart|account|search|checkout|checkouts|apps|cdn|carts|reviews?|testimonials?|comments?)\b|\/(loox|yotpo|judge[\s.-]?me)\b|ביקורות|המלצות[-_]?לקוחות|תגובות|\.(?:jpe?g|png|gif|webp|svg|css|js|woff2?|mp4|zip|pdf)(\?|$)/i;

export const COMMON_POLICY_PATHS = [
  "/policies/shipping-policy",
  "/policies/refund-policy",
  "/policies/return-policy",
  "/policies/terms-of-service",
  "/policies/terms-of-service.html",
  "/pages/shipping",
  "/pages/shipping-policy",
  "/pages/delivery",
  "/pages/shipping-and-returns",
  "/pages/returns",
  "/pages/return-policy",
  "/pages/refund-policy",
  "/pages/exchanges",
  "/pages/faq",
  "/pages/faqs",
  "/pages/contact",
  "/pages/contact-us",
  "/pages/about",
  "/pages/about-us",
  "/pages/our-story",
  "/pages/who-we-are",
  "/pages/הסיפור-שלנו",
  "/pages/warranty",
  "/pages/stores",
  "/pages/locations",
  "/pages/pickup",
  "/pages/order-tracking",
  "/pages/payment",
  "/pages/payments",
  "/pages/promotions",
  "/pages/club",
  "/pages/loyalty",
  "/pages/cancellations",
  "/pages/terms",
  "/shipping",
  "/delivery",
  "/returns",
  "/refund",
  "/faq",
  "/faqs",
  "/contact",
  "/about",
  "/warranty",
  "/משלוחים",
  "/מדיניות-משלוחים",
  "/החזרות",
  "/החלפות",
  "/שאלות-נפוצות",
  "/אודות",
  "/צור-קשר",
  "/תקנון",
  "/pages/אודות",
  "/pages/תקנון",
  "/pages/ביטולי-עסקאות",
  "/pages/יצירת-קשר",
  "/pages/צור-קשר",
  "/ביטולי-עסקאות",
  "/יצירת-קשר",
  "/אודות",
  "/תקנון",
  "/policies/privacy-policy",
  "/pages/משלוחים",
  "/pages/מדיניות-משלוחים",
  "/pages/החזרות",
  "/pages/החלפות",
  "/pages/אחריות",
  "/pages/מועדון",
  "/pages/התאמה-אישית",
  "/pages/custom",
  "/pages/faq-shipping",
  "/pages/shipping-returns",
  "/pages/customer-service",
  "/pages/how-to-return",
  "/pages/how-to-exchange",
  "/pages/track-your-order",
  "/pages/track-order",
  "/pages/tracking",
  "/pages/returns-and-exchanges",
  "/pages/shipping-and-delivery",
  "/pages/damaged-item",
  "/pages/warranty-claim",
  "/pages/after-purchase",
  "/החזרות-והחלפות",
  "/מעקב-משלוח",
  "/pages/מעקב",
  "/pages/תהליך-החזרה",
  "/blogs/news",
  "/blogs/blog",
];

export function groupById(id: TopicGroupId) {
  const group = GROUPS.find((item) => item.id === id);
  if (!group) throw new Error(`Unknown group: ${id}`);
  return group;
}

export function topicById(id: TopicId): TopicDef {
  const topic = TOPICS.find((item) => item.id === id);
  if (!topic) throw new Error(`Unknown topic: ${id}`);
  return topic;
}

export function recommendationFor(
  topic: TopicDef,
  status: TopicStatus,
  numbers: number[],
): { en: string; he: string } {
  const uniqueDays = [...new Set(numbers.filter((n) => n >= 1 && n <= 365))];

  if (status === "missing") {
    return { en: topic.missingEn, he: topic.missingHe };
  }

  if (topic.id === "shipping" && status === "conflict" && uniqueDays.length >= 2) {
    return {
      en: `The site lists different shipping windows (${uniqueDays.join(" vs ")}). Pick the real one, then use it everywhere. Suggested: “Standard shipping in Israel within X business days.”`,
      he: `באתר מופיעים זמני משלוח שונים (${uniqueDays.join(" מול ")}). בחרו את הזמן הנכון, והשתמשו בו בכל העמודים. נוסח מוצע: “משלוח רגיל בישראל תוך X ימי עסקים.”`,
    };
  }

  if (topic.id === "returns" && status === "conflict") {
    return {
      en: "Return windows don’t match across pages. Choose one clear rule (for example 14 days from delivery) and repeat it on every policy page.",
      he: "חלון ההחזרות לא זהה בכל העמודים. בחרו כלל אחד ברור (למשל 14 יום מיום קבלת המשלוח) וכתבו אותו בכל עמודי המדיניות.",
    };
  }

  if (topic.id === "refunds" && status === "conflict") {
    return {
      en: "Refund rules conflict (full refund vs store credit, or different timelines). Decide the real policy, then use the same wording everywhere.",
      he: "באתר כתובים כמה כללים שונים להחזר כספי (החזר מלא מול זיכוי, או לוחות זמנים שונים). החליטו מה המדיניות הנכונה, והשתמשו באותו נוסח בכל מקום.",
    };
  }

  if (status === "unclear") {
    return {
      en: `We found this section, but not a clear sentence. Write one specific line customers and AI can rely on. Suggested page: ${topic.suggestedPath}.`,
      he: `מצאנו את הסקשן, אבל בלי משפט ברור. כתבו שורה אחת מדויקת שלקוח ו-AI יוכלו לסמוך עליה. עמוד מוצע: ${topic.suggestedPath}.`,
    };
  }

  return {
    en: "This looks consistent. Confirm it is still true, then use this wording as the source of truth across the site.",
    he: "זה נראה עקבי. אשרו שזה עדיין נכון, והשתמשו בנוסח הזה כמקור האמת בכל העמודים.",
  };
}
