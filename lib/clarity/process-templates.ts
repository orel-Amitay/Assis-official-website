import type { CustomQaItem, TopicGroupId } from "./types";

export const PROCESS_TOPIC_GROUPS = new Set<TopicGroupId>(["delivery", "returns", "warranty"]);

type ProcessSeed = {
  groupId: TopicGroupId;
  question: string;
  questionEn: string;
  hint: string;
  hintEn: string;
  example: string;
  exampleEn: string;
  collect?: boolean;
};

const SEEDS: ProcessSeed[] = [
  {
    groupId: "general",
    question: "מה התהליך כשלקוח שואל מי אתם / על החברה?",
    questionEn: "What is the process when a customer asks who you are?",
    hint: "איך הסוכן עונה: מי אתם, הסיפור הקצר, ולמה לבחור בכם.",
    hintEn: "How the agent answers: who you are, the short story, and why choose you.",
    example: "1) מציגים את שם המותג ומה מוכרים. 2) מספרים במשפט-שניים איך הכל התחיל. 3) מסבירים למה דווקא אתם.",
    exampleEn: "1) Brand name + what you sell. 2) One or two sentences on how it started. 3) Why choose you.",
  },
  {
    groupId: "general",
    question: "מה לאסוף אם לקוח רוצה להגיע לחנות או לאיסוף?",
    questionEn: "What do we collect if a customer wants to visit or pick up?",
    hint: "שם, טלפון, מתי רוצים להגיע, מספר הזמנה אם יש.",
    hintEn: "Name, phone, when they want to come, order number if they have one.",
    example: "שם מלא, טלפון, יום ושעה מועדפים, מספר הזמנה (אם רלוונטי).",
    exampleEn: "Full name, phone, preferred day/time, order number if relevant.",
    collect: true,
  },
  {
    groupId: "site_qa",
    question: "מה התהליך כשלקוח שואל משהו שכתוב באתר?",
    questionEn: "What is the process when a customer asks something already on the site?",
    hint: "קודם עונים לפי הדף האחד. אם יש סתירה — בודקים מול בעל העסק.",
    hintEn: "Answer from the one customer page first. If it conflicts — check with the merchant.",
    example: "1) עונים לפי הנוסח שאושר כאן. 2) אם הלקוח מביא ציטוט אחר מהאתר — מסמנים לבדיקה. 3) לא ממציאים מדיניות.",
    exampleEn: "1) Answer from the approved wording. 2) If they quote a different site version — flag it. 3) Don’t invent policy.",
  },
  {
    groupId: "promos",
    question: "מה התהליך כשלקוח רוצה לממש קופון או הנחה?",
    questionEn: "What is the process when a customer wants to use a coupon?",
    hint: "איפה מזינים, על מה זה חל, ומה לעשות אם הקוד נכשל.",
    hintEn: "Where to enter it, what it applies to, and what to do if the code fails.",
    example: "1) בודקים שהקוד בתוקף. 2) מוודאים שהוא לא על סייל/חריגים. 3) אם נכשל — אוספים צילום מסך ומספר הזמנה.",
    exampleEn: "1) Check the code is valid. 2) Confirm exclusions. 3) If it fails — collect a screenshot and order number.",
  },
  {
    groupId: "promos",
    question: "מה לאסוף כשקוד קופון לא עובד?",
    questionEn: "What do we collect when a coupon code doesn’t work?",
    hint: "הקוד, צילום מסך, מספר הזמנה, אימייל.",
    hintEn: "The code, screenshot, order number, email.",
    example: "קוד מלא, צילום מסך מהקופה, מספר הזמנה או אימייל, מתי ניסו.",
    exampleEn: "Full code, checkout screenshot, order number or email, when they tried.",
    collect: true,
  },
  {
    groupId: "products",
    question: "מה התהליך כשלקוח שואל על מוצר או התאמה?",
    questionEn: "What is the process when a customer asks about a product or fit?",
    hint: "איך מייעצים בלי להמציא מידות/חומרים שלא כתובים.",
    hintEn: "How to advise without inventing sizes/materials that aren’t written.",
    example: "1) מזהים דגם. 2) עונים לפי עמוד המוצר. 3) אם חסר — אוספים תמונה/מידה ומעבירים לבדיקה.",
    exampleEn: "1) Identify the model. 2) Answer from the PDP. 3) If missing — collect a photo/size and escalate.",
  },
  {
    groupId: "products",
    question: "מה לאסוף בשאלת מוצר / התאמה?",
    questionEn: "What do we collect for a product / fit question?",
    hint: "דגם, מידה, תמונה, שימוש מתוכנן.",
    hintEn: "Model, size, photo, intended use.",
    example: "שם/קישור למוצר, מידה או דגם אקדח, תמונה, למה זה מיועד.",
    exampleEn: "Product name/link, size or model, photo, intended use.",
    collect: true,
  },
  {
    groupId: "prebuy",
    question: "מה תהליך הייעוץ לפני רכישה?",
    questionEn: "What is the pre-purchase advice process?",
    hint: "מתי מייעצים, מתי מעבירים למומחה, ומה אסור להבטיח.",
    hintEn: "When to advise, when to escalate, and what not to promise.",
    example: "1) שואלים מה הצורך. 2) ממליצים לפי מלאי ומדיניות. 3) לא מבטיחים התאמה אישית בלי אישור.",
    exampleEn: "1) Ask what they need. 2) Recommend from stock + policy. 3) Don’t promise custom work without approval.",
  },
  {
    groupId: "prebuy",
    question: "מה לאסוף לפני שממליצים על מוצר?",
    questionEn: "What do we collect before recommending a product?",
    hint: "שימוש, מידה/דגם, תקציב אם רלוונטי, האם יש כבר מוצר דומה.",
    hintEn: "Use case, size/model, budget if relevant, whether they already own something similar.",
    example: "למה צריך, דגם/מידה קיימים, תמונה, האם זה מתנה או לשימוש עצמי.",
    exampleEn: "Why they need it, current model/size, photo, gift vs personal use.",
    collect: true,
  },
  {
    groupId: "influencers",
    question: "מה התהליך כשמגיעים עם קוד משפיענית?",
    questionEn: "What is the process when someone arrives with an influencer code?",
    hint: "איך בודקים שהקוד פעיל, ומה לעשות אם לא.",
    hintEn: "How to check the code is active, and what to do if it isn’t.",
    example: "1) בודקים שהקוד ברשימה הפעילה. 2) מוודאים שאין כפל הנחות. 3) אם לא פעיל — מסבירים ומציעים חלופה מאושרת.",
    exampleEn: "1) Check the live list. 2) Confirm it doesn’t stack. 3) If inactive — explain and offer an approved alternative.",
  },
  {
    groupId: "influencers",
    question: "מה לאסוף בקוד משפיענית?",
    questionEn: "What do we collect for an influencer code?",
    hint: "שם המשפיענית, הקוד, צילום מסך.",
    hintEn: "Influencer name, the code, screenshot.",
    example: "שם המשפיענית, הקוד המלא, צילום מסך, מספר הזמנה אם כבר שילמו.",
    exampleEn: "Influencer name, full code, screenshot, order number if already paid.",
    collect: true,
  },
  {
    groupId: "notes",
    question: "מה התהליך כשיש דגש חשוב או עדכון זמני?",
    questionEn: "What is the process when there is an important note or temporary update?",
    hint: "איך הסוכן מודיע ללקוח בלי להסתיר וגם בלי להפחיד.",
    hintEn: "How the agent tells the customer clearly, without hiding or alarming them.",
    example: "1) אומרים את העדכון במשפט אחד. 2) מה זה משנה להזמנה. 3) מה הלקוח יכול לעשות עכשיו.",
    exampleEn: "1) State the update in one sentence. 2) What it changes for the order. 3) What the customer can do now.",
  },
  {
    groupId: "service",
    question: "מה תהליך פנייה לשירות לקוחות?",
    questionEn: "What is the customer-service intake process?",
    hint: "באיזה ערוץ, תוך כמה זמן חוזרים, ומה קורה מחוץ לשעות.",
    hintEn: "Which channel, how fast you reply, and what happens after hours.",
    example: "1) הלקוח פונה בוואטסאפ/מייל. 2) אוספים פרטים. 3) מענה בשעות הפעילות; מחוץ לשעות — חוזרים ביום העסקים הבא.",
    exampleEn: "1) Customer contacts WhatsApp/email. 2) Collect details. 3) Reply in hours; after hours — next business day.",
  },
  {
    groupId: "service",
    question: "מה לאסוף בכל פנייה לשירות?",
    questionEn: "What do we collect on every support request?",
    hint: "שם, טלפון, מספר הזמנה, במה מדובר.",
    hintEn: "Name, phone, order number, what it’s about.",
    example: "שם מלא, טלפון או אימייל, מספר הזמנה, תיאור קצר, צילום אם רלוונטי.",
    exampleEn: "Full name, phone or email, order number, short description, photo if relevant.",
    collect: true,
  },
  {
    groupId: "billing",
    question: "מה תהליך בקשת חשבונית?",
    questionEn: "What is the invoice-request process?",
    hint: "מתי שולחים, לאיזה מייל, ומה אם לא הגיעה.",
    hintEn: "When you send it, to which email, and what if it didn’t arrive.",
    example: "1) אוספים מספר הזמנה + אימייל/ח.פ. 2) שולחים חשבונית. 3) אם לא הגיעה — בודקים ספאם ושולחים שוב.",
    exampleEn: "1) Collect order number + email/VAT. 2) Send the invoice. 3) If missing — check spam and resend.",
  },
  {
    groupId: "billing",
    question: "מה לאסוף לבקשת חשבונית?",
    questionEn: "What do we collect for an invoice request?",
    hint: "מספר הזמנה, אימייל, ח.פ./עוסק אם צריך.",
    hintEn: "Order number, email, VAT/business number if needed.",
    example: "מספר הזמנה, אימייל למשלוח החשבונית, שם העסק וח.פ. אם רלוונטי.",
    exampleEn: "Order number, invoice email, business name and VAT number if relevant.",
    collect: true,
  },
  {
    groupId: "integrations",
    question: "מה התהליך כשיש תקלה באתר / תשלום / וואטסאפ?",
    questionEn: "What is the process when the site / payment / WhatsApp breaks?",
    hint: "מה הסוכן עושה לפני שמעביר להנהלה.",
    hintEn: "What the agent does before escalating.",
    example: "1) מזהים איפה זה נשבר. 2) אוספים צילום מסך + שעה. 3) מרגיעים את הלקוח ונותנים דרך חלופית להזמין/לשלם.",
    exampleEn: "1) Identify where it broke. 2) Collect screenshot + time. 3) Reassure and offer another way to order/pay.",
  },
];

export function processTemplateQas(): CustomQaItem[] {
  const counts: Partial<Record<TopicGroupId, number>> = {};
  return SEEDS.map((item) => {
    counts[item.groupId] = (counts[item.groupId] || 0) + 1;
    return {
      id: `proc-${item.groupId}-${counts[item.groupId]}`,
      groupId: item.groupId,
      section: "process" as const,
      question: item.question,
      answer: "",
      detailName: "תהליכים",
      forCustomers: false,
      collectFields: item.collect ? [] : undefined,
    };
  });
}

const PROCESS_BY_ID = new Map(processTemplateQas().map((item, index) => [item.id, SEEDS[index]] as const));

export function processHint(id: string, lang: "he" | "en") {
  const seed = PROCESS_BY_ID.get(id);
  if (!seed) return null;
  return lang === "he"
    ? { why: seed.hint, example: seed.example, bullets: [] as string[] }
    : { why: seed.hintEn, example: seed.exampleEn, bullets: [] as string[] };
}

export function withProcessQas(customQas: CustomQaItem[]) {
  const ids = new Set(customQas.map((item) => item.id));
  const extras = processTemplateQas().filter(
    (item) => !ids.has(item.id) && !PROCESS_TOPIC_GROUPS.has(item.groupId),
  );
  if (extras.length === 0) return customQas;
  return [...customQas, ...extras];
}
