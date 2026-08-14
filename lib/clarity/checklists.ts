import type { TopicId } from "./types";

export const SECTION_GUIDE: Record<
  TopicId,
  { aiWhy: string; aiWhyHe: string; write: string[]; writeHe: string[] }
> = {
  about: {
    aiWhy: "Agents need the company bio: who you are, the story, and why customers choose you.",
    aiWhyHe: "הסוכן צריך את הביו של החברה: מי אתם, מה הסיפור, ולמה לקוחות בוחרים בכם.",
    write: [
      "Who you are and what you sell.",
      "The story / bio: when you started, how it began.",
      "Why this brand — what makes you different.",
    ],
    writeHe: [
      "מי אתם ומה המוצרים.",
      "הסיפור / הביו: מתי התחלתם, איך הכל התחיל.",
      "למה דווקא אתם — מה מייחד אתכם.",
    ],
  },
  contact: {
    aiWhy: "So customers get one clear way to reach you — hours and channel.",
    aiWhyHe: "כדי שלקוח יקבל דרך אחת ברורה ליצור קשר — שעות וערוץ.",
    write: [
      "Exact hours (one version only).",
      "WhatsApp / phone / email — which is primary?",
      "Response time: minutes, hours, or next business day?",
    ],
    writeHe: [
      "שעות פעילות מדויקות (גרסה אחת בלבד).",
      "וואטסאפ / טלפון / מייל — מה הערוץ הראשי?",
      "זמן מענה: דקות, שעות, או יום עסקים?",
    ],
  },
  locations: {
    aiWhy: "So AI doesn’t confuse the workshop address with pickup points.",
    aiWhyHe: "כדי שה-AI לא יבלבל בין כתובת הסטודיו לנקודות חלוקה.",
    write: [
      "Full address + how to find it (Waze name).",
      "Visit only by appointment? Phone number?",
      "Is this also where customers return items in person?",
    ],
    writeHe: [
      "כתובת מלאה + איך מגיעים (שם בוייז).",
      "ביקור רק בתיאום? מספר טלפון?",
      "האם לכאן גם מחזירים מוצרים פיזית?",
    ],
  },
  payments: {
    aiWhy: "So AI doesn’t miss Fighter, Bit, or installments.",
    aiWhyHe: "כדי שה-AI לא יפספס פייטר, ביט או תשלומים.",
    write: [
      "All payment methods: Visa / Bit / Fighter / installments.",
      "Is VAT included?",
      "Any card that gets a special discount?",
    ],
    writeHe: [
      "כל אמצעי התשלום: אשראי / ביט / פייטר / תשלומים.",
      "המחירים כוללים מע״מ?",
      "יש כרטיס עם הטבה מיוחדת?",
    ],
  },
  discounts: {
    aiWhy: "So promo answers are current — not leftover homepage banners.",
    aiWhyHe: "כדי שמבצעים יהיו עדכניים — לא באנר ישן מעמוד הבית.",
    write: [
      "How do codes work, and where are they entered?",
      "What is excluded (sale, custom items)?",
      "Can discounts stack?",
    ],
    writeHe: [
      "איך עובדים קופונים, ואיפה מזינים?",
      "על מה ההנחה לא חלה (סייל, התאמה אישית)?",
      "אפשר לשלב הנחות?",
    ],
  },
  gift_cards: {
    aiWhy: "Gift-card rules are asked often and rarely written clearly.",
    aiWhyHe: "כללי גיפט קארד נשאלים הרבה ורק לעיתים רחוקות כתובים ברור.",
    write: [
      "Do you sell gift cards? If not, write: we don’t.",
      "Expiry? Where to redeem?",
      "Can they be used on custom / sale items?",
    ],
    writeHe: [
      "יש גיפט קארד? אם לא — כתבו: אין.",
      "תוקף? איפה מממשים?",
      "אפשר על מוצרים בהתאמה אישית / סייל?",
    ],
  },
  loyalty: {
    aiWhy: "So AI doesn’t invent points or confuse locker points with club points.",
    aiWhyHe: "כדי שה-AI לא ימציא נקודות או יבלבל עם נקודות חלוקה.",
    write: [
      "Is there a club? How do you join (WhatsApp / email)?",
      "What is the benefit (e.g. 5% off)?",
      "If none: write “no loyalty club”.",
    ],
    writeHe: [
      "יש מועדון? איך מצטרפים (וואטסאפ / מייל)?",
      "מה ההטבה (למשל 5% הנחה)?",
      "אם אין: כתבו “אין מועדון לקוחות”.",
    ],
  },
  hot_updates: {
    aiWhy: "Temporary notices (price rise, delay, promo) must beat old site copy.",
    aiWhyHe: "עדכון זמני (התייקרות, עיכוב, מבצע) חייב לנצח טקסט ישן באתר.",
    write: [
      "Any current warning? (prices changing, delay, stock)",
      "Until when is it valid?",
      "If nothing is urgent: write “no temporary updates”.",
    ],
    writeHe: [
      "יש אזהרה פעילה? (מחירים משתנים, עיכוב, מלאי)",
      "עד מתי זה בתוקף?",
      "אם אין משהו דחוף: כתבו “אין עדכון זמני”.",
    ],
  },
  shipping: {
    aiWhy: "Shipping is asked first. One window, one price.",
    aiWhyHe: "משלוחים נשאלים ראשונים. חלון אחד, מחיר אחד.",
    write: [
      "Home delivery: price + business days (one number/range).",
      "When is it free?",
      "Locker / pickup-point price vs home delivery — write both clearly.",
    ],
    writeHe: [
      "משלוח עד הבית: מחיר + ימי עסקים (מספר/טווח אחד).",
      "ממתי זה חינם?",
      "נקודות חלוקה מול עד הבית — כתבו את שניהם בבירור.",
    ],
  },
  international: {
    aiWhy: "So AI doesn’t promise worldwide shipping if you only ship in Israel.",
    aiWhyHe: "כדי שה-AI לא יבטיח משלוח לחו״ל אם אתם שולחים רק בישראל.",
    write: [
      "Do you ship abroad? If not: “Israel only.”",
      "Which countries + how long?",
      "Who pays customs?",
    ],
    writeHe: [
      "יש משלוח לחו״ל? אם לא: “רק בישראל.”",
      "לאילו מדינות + כמה זמן?",
      "מי משלם מכס?",
    ],
  },
  pickup: {
    aiWhy: "Store pickup ≠ locker points. AI must not mix them.",
    aiWhyHe: "איסוף מהחנות ≠ נקודות חלוקה. ה-AI לא צריך לערבב.",
    write: [
      "Can customers pick up at your workshop/store?",
      "Address, hours, ID required?",
      "If only lockers exist, say so here and in shipping.",
    ],
    writeHe: [
      "אפשר לאסוף מהסטודיו/חנות?",
      "כתובת, שעות, תעודה מזהה?",
      "אם יש רק נקודות חלוקה — כתבו את זה כאן וגם במשלוחים.",
    ],
  },
  tracking: {
    aiWhy: "WISMO is most of post-purchase chat. One tracking path.",
    aiWhyHe: "“איפה ההזמנה שלי” זה רוב הצ׳אט אחרי רכישה. מסלול מעקב אחד.",
    write: [
      "How do they track? Email, WhatsApp, or order number?",
      "When does tracking appear (often after production)?",
      "What if tracking isn’t updated yet?",
    ],
    writeHe: [
      "איך עוקבים? מייל, וואטסאפ, או מספר הזמנה?",
      "מתי מופיע מעקב (לעיתים רק אחרי ייצור)?",
      "מה אומרים אם המעקב עדיין לא עודכן?",
    ],
  },
  lead_time: {
    aiWhy: "Custom products: production time ≠ shipping time. AI must split them.",
    aiWhyHe: "מוצר בהתאמה: זמן ייצור ≠ זמן משלוח. ה-AI חייב להפריד.",
    write: [
      "How long to produce a custom item after approval?",
      "In-stock items: ship in how many days?",
      "Does the customer approve a mockup before production starts?",
    ],
    writeHe: [
      "כמה זמן לייצר פריט בהתאמה אחרי אישור?",
      "פריט במלאי: יוצא תוך כמה ימים?",
      "הלקוח מאשר הדמיה לפני שמתחילים לייצר?",
    ],
  },
  returns: {
    aiWhy: "Custom items often cannot be returned. This must be explicit.",
    aiWhyHe: "מוצרים בהתאמה אישית לרוב לא ניתנים להחזרה. חייב להיות מפורש.",
    write: [
      "How many days, from when?",
      "Are custom / personalized items excluded?",
      "Who pays return shipping? In-person return address?",
    ],
    writeHe: [
      "כמה ימים, ומאיזה רגע?",
      "מוצרים בהתאמה אישית יוצאים מהכלל?",
      "מי משלם משלוח החזרה? כתובת להחזרה פיזית?",
    ],
  },
  exchanges: {
    aiWhy: "Exchange rules often differ from returns — especially size vs custom.",
    aiWhyHe: "החלפה שונה מהחזרה — במיוחד מידה מול התאמה אישית.",
    write: [
      "Are exchanges allowed? Size/color only?",
      "Custom items: exchange or remake only?",
      "How does the process work?",
    ],
    writeHe: [
      "יש החלפות? רק מידה/צבע?",
      "התאמה אישית: החלפה או רק תיקון/ייצור מחדש?",
      "איך התהליך עובד?",
    ],
  },
  refunds: {
    aiWhy: "Full refund vs store credit vs Fighter card — pick one rule.",
    aiWhyHe: "החזר מלא מול זיכוי מול כרטיס פייטר — כלל אחד.",
    write: [
      "Refund to original method, or store credit?",
      "How many business days after you receive the item?",
      "Any fee (e.g. 5% / ₪100 cancellation fee)?",
    ],
    writeHe: [
      "החזר לאמצעי המקורי, או זיכוי?",
      "תוך כמה ימי עסקים אחרי שהמוצר חוזר אליכם?",
      "יש דמי ביטול (למשל 5% / ₪100)?",
    ],
  },
  cancellations: {
    aiWhy: "Before it ships vs after production starts — different answers.",
    aiWhyHe: "לפני משלוח מול אחרי שהייצור התחיל — תשובות שונות.",
    write: [
      "Can they cancel before production / before shipping?",
      "After production of a custom item — what happens?",
      "Any cancellation fee?",
    ],
    writeHe: [
      "אפשר לבטל לפני ייצור / לפני משלוח?",
      "אחרי שייצרו פריט בהתאמה — מה קורה?",
      "יש דמי ביטול?",
    ],
  },
  warranty: {
    aiWhy: "Warranty on product vs clips vs manufacturing defect.",
    aiWhyHe: "אחריות על מוצר מול קליפסים מול פגם ייצור.",
    write: [
      "How long, and what is covered?",
      "Any part with a longer warranty (e.g. clips 5 years)?",
      "What is not covered (wear, misuse)?",
    ],
    writeHe: [
      "לכמה זמן, ועל מה?",
      "יש חלק עם אחריות ארוכה יותר (למשל קליפסים 5 שנים)?",
      "מה לא כלול (בלאי, שימוש לא נכון)?",
    ],
  },
  customization: {
    aiWhy: "Custom flow is the business. AI must know the exact steps.",
    aiWhyHe: "תהליך ההתאמה הוא העסק. ה-AI חייב לדעת את השלבים.",
    write: [
      "How does custom order work? (WhatsApp → measure → approve → produce)",
      "What does the customer need to send (photos, model, light)?",
      "Can they change details after approval?",
    ],
    writeHe: [
      "איך עובדת הזמנה בהתאמה? (וואטסאפ → מידה → אישור → ייצור)",
      "מה הלקוח צריך לשלוח (תמונות, דגם, פנס)?",
      "אפשר לשנות פרטים אחרי אישור?",
    ],
  },
  courier: {
    aiWhy: "Customers ask who the courier is and how to schedule arrival.",
    aiWhyHe: "לקוחות שואלים מי חברת המשלוחים ואיך מתאמים הגעה.",
    write: [
      "Which courier?",
      "SMS / call / leave at the door?",
      "Can they pick a delivery window?",
    ],
    writeHe: [
      "עם איזו חברת משלוחים?",
      "סמס / שיחה / השארה בדלת?",
      "אפשר לבחור חלון זמנים?",
    ],
  },
  stock: {
    aiWhy: "Out of stock and preorder change delivery promises.",
    aiWhyHe: "מלאי אזל והזמנה מוקדמת משנים את הבטחת האספקה.",
    write: [
      "What if it’s out of stock?",
      "Is there a restock alert?",
      "What does preorder mean for timing?",
    ],
    writeHe: [
      "מה אם אזל מהמלאי?",
      "יש עדכון חזרה למלאי?",
      "מה המשמעות של הזמנה מוקדמת לזמן אספקה?",
    ],
  },
  order: {
    aiWhy: "Order changes after checkout are a common support question.",
    aiWhyHe: "שינוי הזמנה אחרי תשלום זו פנייה נפוצה.",
    write: [
      "Can they edit or merge orders?",
      "Phone orders?",
      "Address change only?",
    ],
    writeHe: [
      "אפשר לערוך או לאחד הזמנות?",
      "הזמנה בטלפון?",
      "רק שינוי כתובת?",
    ],
  },
  invoices: {
    aiWhy: "Invoice requests are a daily ops question.",
    aiWhyHe: "בקשות לחשבונית הן פנייה יומיומית.",
    write: [
      "When is the invoice sent?",
      "Which email?",
      "What if it didn’t arrive?",
    ],
    writeHe: [
      "מתי נשלחת החשבונית?",
      "לאיזה מייל?",
      "מה אם לא הגיעה?",
    ],
  },
  defects: {
    aiWhy: "Damaged-on-arrival needs a clear evidence + next-step path.",
    aiWhyHe: "פגם בהגעה צריך מסלול ברור: ראיות ומה קורה אחר כך.",
    write: [
      "What to send (photo/video)?",
      "Where to send it?",
      "Repair, replace, or refund?",
    ],
    writeHe: [
      "מה לשלוח (תמונה/סרטון)?",
      "לאן שולחים?",
      "תיקון, החלפה או החזר?",
    ],
  },
  process_shipping: {
    aiWhy: "Agents need the delivery playbook + what to ask when a shipment is late.",
    aiWhyHe: "הסוכן צריך את תהליך המשלוח ומה לשאול כשיש עיכוב.",
    write: ["Shipping steps.", "What to collect for status.", "Delay process."],
    writeHe: ["שלבי משלוח.", "מה לאסוף לסטטוס.", "תהליך עיכוב."],
  },
  process_return: {
    aiWhy: "Agents need the return playbook + intake fields, not just the policy window.",
    aiWhyHe: "הסוכן צריך את תהליך ההחזרה ומה לאסוף — לא רק כמה ימים.",
    write: ["Step-by-step return.", "What to collect to start.", "What is needed to finish."],
    writeHe: ["החזרה שלב-אחרי-שלב.", "מה לאסוף כדי להתחיל.", "מה צריך כדי לסיים."],
  },
  process_exchange: {
    aiWhy: "Exchange flow is different from return — size/model + stock check.",
    aiWhyHe: "החלפה שונה מהחזרה — מידה/דגם + בדיקת מלאי.",
    write: ["Step-by-step exchange.", "What to collect to start.", "What is needed to finish."],
    writeHe: ["החלפה שלב-אחרי-שלב.", "מה לאסוף כדי להתחיל.", "מה צריך כדי לסיים."],
  },
  process_refund: {
    aiWhy: "Refund vs credit, and the exact details before money moves.",
    aiWhyHe: "החזר מול זיכוי, והפרטים המדויקים לפני שמזיזים כסף.",
    write: ["When refund starts.", "What payment details to collect.", "How completion is confirmed."],
    writeHe: ["מתי מתחיל ההחזר.", "אילו פרטי תשלום לאסוף.", "איך מאשרים סיום."],
  },
  process_cancel: {
    aiWhy: "Cancel before ship vs after production — different intake.",
    aiWhyHe: "ביטול לפני משלוח מול אחרי ייצור — איסוף מידע שונה.",
    write: ["Cancellation steps.", "Order number + shipped/in-production?"],
    writeHe: ["שלבי הביטול.", "מספר הזמנה + האם יצאה/בייצור?"],
  },
  process_defect: {
    aiWhy: "A defect claim must not start without evidence + order identity.",
    aiWhyHe: "תקלת פגם לא מתחילה בלי ראיות + זיהוי הזמנה.",
    write: ["Claim steps.", "Photo, video, order number, arrival date."],
    writeHe: ["שלבי התקלה.", "תמונה, סרטון, מספר הזמנה, תאריך הגעה."],
  },
  integrations: {
    aiWhy: "Agents need to know which systems the store actually uses.",
    aiWhyHe: "הסוכן צריך לדעת לאילו מערכות החנות באמת מחוברת.",
    write: ["Ecommerce platform.", "Ads / Google / Meta.", "WhatsApp, email, payments, ERP."],
    writeHe: ["פלטפורמת החנות.", "פרסום / Google / Meta.", "וואטסאפ, מייל, תשלומים, ERP."],
  },
  product_info: {
    aiWhy: "Only keep product facts that help a customer choose or use the item.",
    aiWhyHe: "להשאיר במוצר רק מידע שעוזר לבחור או להשתמש בפריט.",
    write: ["Materials, sizes, care.", "What does not belong on the PDP."],
    writeHe: ["חומרים, מידות, טיפול.", "מה לא שייך לעמוד המוצר."],
  },
  product_edit: {
    aiWhy: "Cleanup is actionable only if we know what to edit on each product.",
    aiWhyHe: "ניקוי מוצרים עובד רק אם יודעים מה לערוך בכל מוצר.",
    write: ["Title / description / images.", "Remove policy text.", "Size chart / variants."],
    writeHe: ["כותרת / תיאור / תמונות.", "להוריד מדיניות מהתיאור.", "טבלת מידות / ווריאציות."],
  },
};
