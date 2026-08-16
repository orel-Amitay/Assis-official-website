import { isReviewPage, isUsableKbAnswer } from "./extract";
import { templateExample, templateQas } from "./import-kb";
import { GROUP_PAGE_HINTS } from "./kb-template";
import { GROUPS, TOPICS } from "./topics";
import type { ClarityLang } from "./copy";
import type { PageSnapshot } from "./extract";
import type { TopicGroupId, TopicId } from "./types";

export type CategorySuggestion = {
  topicId: TopicId;
  qaId: string;
  answer: string;
  missing: boolean;
  notApplicable?: boolean;
  sourceUrl?: string;
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

const FILL_STOP = new Set([
  "את",
  "של",
  "על",
  "עם",
  "או",
  "לא",
  "גם",
  "זה",
  "זו",
  "הוא",
  "היא",
  "יש",
  "אין",
  "כל",
  "מה",
  "איך",
  "אם",
  "כי",
  "האם",
  "כיצד",
  "נא",
  "the",
  "and",
  "for",
  "from",
  "with",
  "your",
  "you",
  "our",
  "are",
  "is",
  "to",
  "in",
  "of",
  "a",
  "if",
  "do",
  "does",
  "can",
  "how",
  "what",
]);

function questionNeedles(questions: Array<{ question: string }>) {
  const words = questions.flatMap((item) =>
    item.question
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .split(/\s+/)
      .filter((word) => word.length >= 4 && !FILL_STOP.has(word)),
  );
  return [...new Set(words)].slice(0, 50);
}

function packPageText(text: string, needles: string[], maxChars: number) {
  if (text.length <= maxChars) return text;
  const chunks: string[] = [];
  const head = Math.min(2400, Math.floor(maxChars * 0.35));
  const tail = Math.min(2400, Math.floor(maxChars * 0.3));
  chunks.push(text.slice(0, head));
  const lower = text.toLowerCase();
  for (const needle of needles) {
    let from = 0;
    let hits = 0;
    while (hits < 3) {
      const idx = lower.indexOf(needle, from);
      if (idx < 0) break;
      const start = Math.max(0, idx - 500);
      const end = Math.min(text.length, idx + needle.length + 900);
      chunks.push(text.slice(start, end));
      from = idx + needle.length;
      hits += 1;
    }
  }
  chunks.push(text.slice(Math.max(0, text.length - tail)));
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const chunk of chunks) {
    const key = chunk.slice(0, 80);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(chunk);
  }
  return unique.join("\n…\n").slice(0, maxChars);
}

function pageBundle(pages: PageSnapshot[], questions: Array<{ question: string }> = []) {
  const needles = questionNeedles(questions);
  let budget = 72000;
  const parts: string[] = [];
  for (const page of pages.filter((item) => !isReviewPage(item.path, item.title)).slice(0, 28)) {
    const highValue = /\/policies\/|\/pages\/|faq|משלוח|החזר|shipping|return|about|אודות/i.test(
      `${page.path} ${page.title}`,
    );
    const cap = Math.min(highValue ? 8500 : 5200, budget);
    if (cap < 1200) break;
    const body = packPageText(page.text, needles, cap);
    parts.push(`URL: ${page.url}\nTITLE: ${page.title}\n${body}`);
    budget -= body.length + 40;
    if (budget < 3500) break;
  }
  return parts.join("\n\n---\n\n");
}

function questionList(groupId: TopicGroupId, _lang: ClarityLang) {
  return templateQas()
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
      notApplicable?: boolean;
      sourceUrl?: string;
      source?: string;
    }>;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      const qaId = String(item.qaId || item.id || "");
      const topicId = String(item.topicId || qaId.split(".")[0] || "") as TopicId;
      if (!allowed.has(qaId)) return [];
      const answer = String(item.answer || "").trim();
      const notApplicable = Boolean(item.notApplicable);
      if (answer && !notApplicable && !isUsableKbAnswer(answer)) return [];
      return [
        {
          topicId,
          qaId,
          answer,
          missing: Boolean(item.missing) || (!answer && !notApplicable),
          notApplicable,
          sourceUrl: String(item.sourceUrl || item.source || "").trim() || undefined,
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
          generationConfig: { temperature: 0.15, maxOutputTokens: 8192 },
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
  if (questions.length === 0) return [];
  const focused = pagesForGroup(input.groupId, input.pages);
  if (focused.length === 0) return [];
  if (!geminiKey() && !openaiKey()) return [];

  const he = input.lang === "he";
  const chunks: typeof questions[] = [];
  for (let i = 0; i < questions.length; i += 8) chunks.push(questions.slice(i, i + 8));

  const out: CategorySuggestion[] = [];
  for (const chunk of chunks) {
    const prompt = [
      he
        ? `אתה ממלא שאלון מאגר ידע לחנות, לקטגוריה אחת בלבד: ${input.groupTitle}.`
        : `Fill a knowledge-base questionnaire for one category only: ${input.groupTitle}.`,
      he
        ? "ענה רק על השאלות שניתנו. אל תוסיף שאלות חדשות ואל תערב נושאים מקטגוריה אחרת."
        : "Answer only the given questions. Do not add questions or mix in other categories.",
      he
        ? "התאם את השאלון לעסק הזה. סמן notApplicable רק אם ברור שהנושא לא שייך לחנות. אל תמציא תוכניות שאין באתר."
        : "Adapt the questionnaire to THIS store. Mark notApplicable only if the topic clearly does not belong. Do not invent programs the site does not have.",
      he
        ? "כתוב תשובות בעברית, בקול החנות (אנחנו). חפש בכל הטקסט: פוטר, FAQ, מדיניות, אודות, משלוחים והחזרות. אם זה כתוב באתר — ענה, גם אם זה קצר."
        : "Store-voice facts from the scanned site. Search footer, FAQ, policies, about, shipping and returns. If it is on the site, answer it, even if short.",
      he
        ? "סמן missing רק אחרי שחיפשת ולא מצאת. אם כתוב במפורש שאין דבר כזה — ענה שאין, missing: false."
        : "Mark missing only after searching and not finding it. If the site says it does not offer that — answer that it does not, missing: false.",
      he
        ? " לכל תשובה עם עובדה מהאתר הוסף sourceUrl של העמוד המדויק מהרשימה. אם יש דוגמת סגנון — חקה עומק רק עם עובדות מהאתר."
        : "For every fact from the site, add sourceUrl of that exact page. Style examples: match depth using only this store’s facts.",
      "Return JSON only: [{\"qaId\":\"tpl-1\",\"topicId\":\"about\",\"answer\":\"...\",\"missing\":false,\"notApplicable\":false,\"sourceUrl\":\"https://...\"}]",
      "Questions:",
      ...chunk.map((item) =>
        item.example
          ? `- ${item.qaId}: ${item.question}\n  style example: ${item.example.slice(0, 420)}`
          : `- ${item.qaId}: ${item.question}`,
      ),
      "Site text:",
      pageBundle(focused, chunk),
    ].join("\n");
    const raw = (await runGemini(prompt)) || (await runOpenAi(prompt));
    if (!raw) continue;
    out.push(...parseSuggestions(raw, new Set(chunk.map((item) => item.qaId))));
  }

  const answered = new Set(
    out
      .filter((item) => item.notApplicable || (item.answer.trim() && !item.missing))
      .map((item) => item.qaId),
  );
  const unanswered = questions.filter((item) => !answered.has(item.qaId));
  if (unanswered.length > 0) {
    for (let i = 0; i < unanswered.length; i += 8) {
      const chunk = unanswered.slice(i, i + 8);
      const prompt = [
        he
          ? `השלם שאלות שחסרות להן תשובה בקטגוריה ${input.groupTitle}. חפש שוב בכל העמודים, כולל פוטר ו-FAQ.`
          : `Fill remaining unanswered questions for ${input.groupTitle}. Search all pages again, including footer and FAQ.`,
        he
          ? "אם מצאת תשובה באתר — כתוב אותה. missing רק אם באמת אין."
          : "If the site has the answer, write it. Mark missing only if it is truly absent.",
        "Return JSON only: [{\"qaId\":\"tpl-1\",\"topicId\":\"about\",\"answer\":\"...\",\"missing\":false,\"notApplicable\":false,\"sourceUrl\":\"https://...\"}]",
        "Questions:",
        ...chunk.map((item) => `- ${item.qaId}: ${item.question}`),
        "Site text:",
        pageBundle(input.pages, chunk),
      ].join("\n");
      const raw = (await runGemini(prompt)) || (await runOpenAi(prompt));
      if (!raw) continue;
      for (const item of parseSuggestions(raw, new Set(chunk.map((row) => row.qaId)))) {
        const prev = out.findIndex((row) => row.qaId === item.qaId);
        if (prev >= 0) {
          if ((!out[prev].answer.trim() || out[prev].missing) && item.answer.trim() && !item.missing) {
            out[prev] = item;
          }
        } else {
          out.push(item);
        }
      }
    }
  }
  return out;
}

export function hasCategoryAi() {
  return Boolean(geminiKey() || openaiKey());
}

function pageScore(page: PageSnapshot, groupId: TopicGroupId) {
  const hint = GROUP_PAGE_HINTS[groupId];
  const topics = TOPICS.filter((topic) => topic.group === groupId);
  const blob = `${page.path} ${page.title} ${page.text.slice(0, 4000)} ${page.text.slice(-2500)}`;
  let score = 0;
  if (page.path === "/" || page.path === "") score += 8;
  if (/\/policies\//i.test(page.path) || /\/pages\//i.test(page.path)) score += 10;
  if (/faq|שאלות[-_ ]?נפוצות/i.test(blob)) score += 12;
  if (page.path === "/__site-index" || page.path === "/__social" || page.path === "/__shop") score += 12;
  if (/\/products\//i.test(page.path)) score -= 4;
  if (hint?.test(blob)) score += 14;
  if (hint?.test(page.text.slice(-2500))) score += 8;
  for (const topic of topics) {
    if (topic.pathHints.test(page.path) || topic.pathHints.test(page.title)) score += 8;
    if (topic.keywords.test(page.text.slice(0, 8000)) || topic.keywords.test(page.text.slice(-2500))) score += 6;
  }
  return score;
}

function pagesForGroup(groupId: TopicGroupId, pages: PageSnapshot[]) {
  const usable = pages.filter((page) => !isReviewPage(page.path, page.title));
  const ranked = usable
    .map((page) => ({ page, score: pageScore(page, groupId) }))
    .sort((a, b) => b.score - a.score);
  const selected: PageSnapshot[] = [];
  const seen = new Set<string>();
  for (const row of ranked) {
    if (row.score <= 0 && selected.length >= 8) continue;
    if (seen.has(row.page.url)) continue;
    seen.add(row.page.url);
    selected.push(row.page);
    if (selected.length >= 24) break;
  }
  if (selected.length > 0) return selected;
  return usable.filter((page) => page.path === "/" || /\/policies\/|\/pages\//i.test(page.path)).slice(0, 12);
}

export type AiFillProgress = {
  index: number;
  done: number;
  total: number;
  groupTitle: string;
  etaSec: number;
};

const SECONDS_PER_PAIR = 22;

export async function aiFillStore(input: {
  pages: PageSnapshot[];
  lang: ClarityLang;
  onProgress?: (event: AiFillProgress) => void | Promise<void>;
}): Promise<CategorySuggestion[]> {
  if (!hasCategoryAi() || input.pages.length === 0) return [];
  const groups = GROUPS.filter((group) => questionList(group.id, input.lang).length > 0);
  const suggestions: CategorySuggestion[] = [];
  for (let index = 0; index < groups.length; index += 2) {
    const chunk = groups.slice(index, index + 2);
    const remainingPairs = Math.ceil((groups.length - index) / 2);
    const groupTitle = chunk
      .map((group) => (input.lang === "he" ? group.titleHe : group.title))
      .join(" · ");
    await input.onProgress?.({
      index,
      done: Math.min(index + chunk.length, groups.length),
      total: groups.length,
      groupTitle,
      etaSec: remainingPairs * SECONDS_PER_PAIR,
    });
    const parts = await Promise.all(
      chunk.map((group) =>
        aiFillCategory({
          groupId: group.id,
          groupTitle: input.lang === "he" ? group.titleHe : group.title,
          pages: input.pages,
          lang: input.lang,
        }),
      ),
    );
    suggestions.push(...parts.flat());
  }
  return suggestions.filter((item) => item.notApplicable || (!item.missing && item.answer.trim()));
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
      if (!question || !answer || !isUsableKbAnswer(answer)) return [];
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
