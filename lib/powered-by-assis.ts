export type PoweredByAssisItem = {
  icon: string;
  title: string;
  body: string;
};

/**
 * Powered by Assis onboarding copy.
 * Ordered: store foundation → customer experience → team → partnership.
 */
export function getPoweredByAssisItems(brandName = "your brand"): PoweredByAssisItem[] {
  return [
    {
      icon: "storefront",
      title: "Shopify connected",
      body: "Your store is linked - products, inventory, and orders - so Assis can answer with live information, from shopping questions to order status.",
    },
    {
      icon: "forum",
      title: "Always-on across channels",
      body: "Customers can reach you anytime through the website plugin, WhatsApp, and email. Assis AI is available 24/7.",
    },
    {
      icon: "menu_book",
      title: "Knowledge Base",
      body: "Answers come from your Knowledge Base and product data. Keep it updated - the clearer it is, the better Assis responds.",
    },
    {
      icon: "record_voice_over",
      title: "Tone & behavior",
      body: `We can tune how Assis speaks - tone, wording, guidance, and how it handles different situations - so it feels like ${brandName}.`,
    },
    {
      icon: "sync_alt",
      title: "Seamless handoff",
      body: "Customers can continue from the website chat into WhatsApp or email. When a person is needed, the conversation moves straight to your team in AssisWorld.",
    },
    {
      icon: "inbox",
      title: "AssisWorld",
      body: "Your team’s workspace for every conversation that needs human attention - reply, follow up, and stay in context.",
    },
    {
      icon: "monitoring",
      title: "Operational view",
      body: "See conversations, handoffs, volume, and response activity in one place - so you always know what’s happening on the customer side.",
    },
    {
      icon: "handshake",
      title: "Your Assis contact",
      body: "A dedicated contact for setup and ongoing tuning. Reach out anytime to refine answers, adjust behavior, or improve how Assis works for your store.",
    },
  ];
}

export const POWERED_BY_ASSIS_INTRO =
  "Your Powered by Assis package is live. Here’s how everything fits together - for your customers, and for your team.";

export const POWERED_BY_ASSIS_FOOTER =
  "Want to refine answers or adjust the experience? We’re here with you - just reach out.";

export const POWERED_BY_ASSIS_PDF_HREF = "/docs/What-you-now-have-with-Assis.pdf";
