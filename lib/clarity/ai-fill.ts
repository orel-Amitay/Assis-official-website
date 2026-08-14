import { isReviewPage, isUsableStoreFact } from "./extract";
import { isProcessTopic } from "./focus";
import { templateExample, templateQas } from "./import-kb";
import { questionsForTopic, questionLabel } from "./qa";
import { GROUPS, TOPICS } from "./topics";
import type { ClarityLang } from "./copy";
import type { PageSnapshot } from "./extract";
import type { TopicGroupId, TopicId } from "./types";

export type CategorySuggestion = {
  topicId: TopicId;
  qaId: string;
  answer: string;
  missing: boolean;
};

export type OpenQaSuggestion = {
  question: string;
  answer: string;
};

function geminiKey() {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    ""
  ).trim();
}

function openaiKey() {
  return String(process.env.OPENAI_API_KEY || "").trim();
}

function pageBundle(pages: PageSnapshot[]) {
  return pages
    .filter((page) => !isReviewPage(page.path, page.title))
    .slice(0, 12)
    .map((page) => `URL: ${page.path || page.url}\n${page.text.slice(0, 3500)}`)
    .join("\n\n---\n\n")
    .slice(0, 28000);
}

function questionList(groupId: TopicGroupId, lang: ClarityLang) {
  const template = templateQas()
    .filter((item) => item.groupId === groupId)
    .map((item) => ({
      topicId: "about" as TopicId,
      qaId: item.id,
      question:
        item.detailName && item.question && item.question !== item.detailName
          ? `[${item.detailName}] ${item.question}`
          : item.question || item.detailName || "",
      example: templateExample(item.id),
    }));
  const process = TOPICS.filter((topic) => topic.group === groupId && isProcessTopic(topic.id)).flatMap((topic) =>
    questionsForTopic(topic.id).map((def) => ({
      topicId: topic.id,
      qaId: def.id,
      question: questionLabel(def, lang),
      example: "",
    })),
  );
  return [...template, ...process];
}

function parseSuggestions(raw: string, allowed: Set<string>): CategorySuggestion[] {
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start < 0 || end <= start) return [];
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1)) as Array<{
      id?: string;
      qaId?: string;
      topicId?: string;
      answer?: string;
      missing?: boolean;
    }>;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      const qaId = String(item.qaId || item.id || "");
      const topicId = String(item.topicId || qaId.split(".")[0] || "") as TopicId;
      if (!allowed.has(qaId)) return [];
      const answer = String(item.answer || "").trim();
      if (answer && !isUsableStoreFact(answer)) return [];
      return [
        {
          topicId,
          qaId,
          answer,
          missing: Boolean(item.missing) || !answer,
        },
      ];
    });
  } catch {
    return [];
  }
}

const GEMINI_MODELS = ["gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-3-flash-preview"];

async function runGemini(prompt: string) {
  const key = geminiKey();
  if (!key) return "";
  for (const model of GEMINI_MODELS) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 4096 },
        }),
      },
    );
    if (!response.ok) continue;
    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n") || "";
    if (text.trim()) return text;
  }
  return "";
}

async function runOpenAi(prompt: string) {
  const key = openaiKey();
  if (!key) return "";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!response.ok) return "";
  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content || "";
}

export async function aiFillCategory(input: {
  groupId: TopicGroupId;
  groupTitle: string;
  pages: PageSnapshot[];
  lang: ClarityLang;
}): Promise<CategorySuggestion[]> {
  const questions = questionList(input.groupId, input.lang);
  if (questions.length === 0 || input.pages.length === 0) return [];
  const focused = pagesForGroup(input.groupId, input.pages);
  if (focused.length === 0) return [];
  if (!geminiKey() && !openaiKey()) return [];

  const he = input.lang === "he";
  const prompt = [
    he
      ? `אתה מחלץ עובדות מדויקות מחנות אינטרנט לקטגוריה אחת בלבד: ${input.groupTitle}.`
      : `Extract accurate store facts for one category only: ${input.groupTitle}.`,
    he
      ? "אל תשתמש בביקורות לקוחות, תגובות, המלצות, דירוגים או ציטוטים אישיים."
      : "Do not use customer reviews, comments, testimonials, ratings, or personal quotes.",
    he
      ? "כתוב תשובות בעברית, בקול החנות (אנחנו). רק עובדות קונקרטיות שכתובות באתר: מספרים, תנאים, כן/לא ברור. בלי ביקורות לקוחות, בלי בדרך כלל/לרוב/אולי, ובלי ניחושים. אם זה לא כתוב באתר — missing: true ותשובה ריקה."
      : "Write concrete store-voice facts from the site only: numbers, conditions, clear yes/no. No reviews, no usually/typically/maybe, no guesses. If the site doesn’t say it — missing: true and an empty answer.",
    he
      ? "אם יש דוגמת סגנון — חקה את העומק והמבנה, אבל רק עם עובדות מהאתר הנסרק. אל תעתיק שמות/מחירים/כתובות מהדוגמה."
      : "If a style example is given, match its depth — using only facts from the scanned site, never names/prices/addresses from the example.",
    "Return JSON only: [{\"qaId\":\"tpl-1\",\"topicId\":\"about\",\"answer\":\"...\",\"missing\":false}]",
    "Questions:",
    ...questions.map((item) =>
      item.example
        ? `- ${item.qaId}: ${item.question}\n  style example: ${item.example.slice(0, 420)}`
        : `- ${item.qaId}: ${item.question}`,
    ),
    "Site text:",
    pageBundle(focused),
  ].join("\n");

  const raw = (await runGemini(prompt)) || (await runOpenAi(prompt));
  if (!raw) return [];
  return parseSuggestions(raw, new Set(questions.map((item) => item.qaId)));
}

export function hasCategoryAi() {
  return Boolean(geminiKey() || openaiKey());
}

function pagesForGroup(groupId: TopicGroupId, pages: PageSnapshot[]) {
  const usable = pages.filter((page) => !isReviewPage(page.path, page.title));
  const topics = TOPICS.filter((topic) => topic.group === groupId);
  const home = usable.filter((page) => page.path === "/" || page.path === "");
  const matched = usable.filter((page) =>
    topics.some(
      (topic) =>
        topic.pathHints.test(page.path) ||
        topic.pathHints.test(page.title) ||
        topic.keywords.test(page.text.slice(0, 2500)),
    ),
  );
  const seen = new Set<string>();
  const selected: PageSnapshot[] = [];
  for (const page of [...home, ...matched]) {
    if (seen.has(page.url)) continue;
    seen.add(page.url);
    selected.push(page);
    if (selected.length >= 10) break;
  }
  return selected;
}

export async function aiFillStore(input: {
  pages: PageSnapshot[];
  lang: ClarityLang;
}): Promise<CategorySuggestion[]> {
  if (!hasCategoryAi() || input.pages.length === 0) return [];
  const groups = GROUPS.filter((group) => TOPICS.some((topic) => topic.group === group.id));
  const suggestions: CategorySuggestion[] = [];
  for (let index = 0; index < groups.length; index += 3) {
    const chunk = groups.slice(index, index + 3);
    const parts = await Promise.all(
      chunk.map((group) =>
        aiFillCategory({
          groupId: group.id,
          groupTitle: input.lang === "he" ? group.titleHe : group.title,
          pages: pagesForGroup(group.id, input.pages),
          lang: input.lang,
        }),
      ),
    );
    suggestions.push(...parts.flat());
  }
  return suggestions.filter((item) => !item.missing && item.answer.trim());
}

function parseOpenQuestions(raw: string): OpenQaSuggestion[] {
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start < 0 || end <= start) return [];
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1)) as Array<{ question?: string; answer?: string }>;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      const question = String(item.question || "").trim();
      const answer = String(item.answer || "").trim();
      if (!question || !answer || !isUsableStoreFact(answer)) return [];
      return [{ question, answer }];
    });
  } catch {
    return [];
  }
}

export async function aiFillOpenQuestions(input: {
  pages: PageSnapshot[];
  lang: ClarityLang;
  existingQuestions: string[];
}): Promise<OpenQaSuggestion[]> {
  if (!hasCategoryAi() || input.pages.length === 0) return [];
  const he = input.lang === "he";
  const existing = input.existingQuestions.map((value) => value.trim()).filter(Boolean).slice(0, 90);
  const prompt = [
    he
      ? "חלץ שאלות ותשובות פתוחות נוספות מהאתר — רק עובדות חשובות ורלוונטיות ללקוח או לסוכן, שלא נמצאות ברשימה."
      : "Extract extra open Q&A from the site — only important, relevant facts not already in the list.",
    he
      ? "עברית, קול החנות (אנחנו). בלי ביקורות לקוחות, תגובות או המלצות. עד 12 שאלות. אם אין משהו חדש — החזר []."
      : "Store voice. No customer reviews, comments, or testimonials. Up to 12 questions. If nothing new, return [].",
    "Return JSON only: [{\"question\":\"...\",\"answer\":\"...\"}]",
    "Already covered:",
    ...existing.map((question) => `- ${question}`),
    "Site text:",
    pageBundle(input.pages),
  ].join("\n");
  const raw = (await runGemini(prompt)) || (await runOpenAi(prompt));
  if (!raw) return [];
  const seen = new Set(existing.map((value) => value.toLowerCase().replace(/\s+/g, " ")));
  return parseOpenQuestions(raw)
    .filter((item) => {
      const key = item.question.toLowerCase().replace(/\s+/g, " ");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12);
}
