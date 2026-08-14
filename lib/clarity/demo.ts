import { buildScanResult } from "./extract";
import { draftFromKnowledgeBase } from "./import-kb";
import mraKb from "./fixtures/knowledge-base-mra-il.json";
import type { KnowledgeCategory } from "./review-state";
import type { ClarityDraft } from "./draft";

export function demoMraDraft(): ClarityDraft {
  return draftFromKnowledgeBase(mraKb as KnowledgeCategory[], {
    storeUrl: "https://mra-il.com",
    storeName: "MRA IL",
    demo: true,
  });
}

/** Sample scan covering consumer store policies only. */
export function demoScanResult() {
  return buildScanResult({
    demo: true,
    storeUrl: "https://nura-home.example",
    storeName: "Nura Home",
    pages: [
      {
        url: "https://nura-home.example/",
        title: "Nura Home",
        path: "/",
        text: `Nura Home. Free shipping on orders over ₪250. Customer service Sunday–Thursday 9:00–17:00. WhatsApp support on the website. We accept Visa, Mastercard, Apple Pay and Bit.`,
      },
      {
        url: "https://nura-home.example/pages/contact",
        title: "Contact",
        path: "/pages/contact",
        text: `Customer service Sunday–Thursday 9:00–17:00. Email hello@nura-home.example or WhatsApp from the site.`,
      },
      {
        url: "https://nura-home.example/policies/shipping-policy",
        title: "Shipping policy",
        path: "/policies/shipping-policy",
        text: `Standard shipping in Israel takes up to 14 business days. Express shipping is 2–4 business days. Self-pickup from the Herzliya studio is free. Shipping to the US takes up to 21 business days. A tracking link is emailed when the order ships.`,
      },
      {
        url: "https://nura-home.example/pages/faq",
        title: "FAQ",
        path: "/pages/faq",
        text: `When will my order arrive? Delivery can take up to 72 business days. Do you ship worldwide? Yes, international shipping is available at checkout.`,
      },
      {
        url: "https://nura-home.example/pages/תקנון",
        title: "תקנון",
        path: "/pages/תקנון",
        text: `הרכישה כפופה לתקנון האתר ולסמכות השיפוט בישראל. הגבלת אחריות וקניין רוחני חלים על השימוש באתר. ניתן לבטל הזמנה עד יציאה למשלוח. החזרת מוצר שלא בשימוש אפשרית תוך 14 יום מקבלת המשלוח.`,
      },
      {
        url: "https://nura-home.example/policies/refund-policy",
        title: "Return & refund policy",
        path: "/policies/refund-policy",
        text: `You may return unused items within 14 days of delivery. Once we receive the item, a full refund will be issued to the original payment method within 10 business days. Sale items cannot be returned.`,
      },
      {
        url: "https://nura-home.example/pages/returns",
        title: "Returns",
        path: "/pages/returns",
        text: `Changed your mind? You have 30 days to return your order. Refunds are issued as store credit only. Exchanges are available for 14 days.`,
      },
      {
        url: "https://nura-home.example/pages/warranty",
        title: "Warranty",
        path: "/pages/warranty",
        text: `All furniture includes a 12-month warranty against manufacturing defects. Textiles have a 6-month warranty.`,
      },
      {
        url: "https://nura-home.example/pages/payment",
        title: "Payment",
        path: "/pages/payment",
        text: `We accept Visa, Mastercard, Apple Pay, Google Pay, and Bit. Prices include VAT.`,
      },
    ],
  });
}
