export const NAV_LINKS = [
  { label: "Packages", id: "packages" },
  { label: "Results", id: "results" },
  { label: "Platforms", id: "platforms" },
  { label: "Stores", id: "testimonials" },
  { label: "FAQ", id: "faq" },
] as const;

export const HERO_KPIS = [
  { value: "6x", label: "Average ROI", hint: "on every $ with Assis" },
  { value: "86%", label: "Revenue saved", hint: "at-risk sales recovered" },
  { value: "43%", label: "Chat conversion", hint: "avg. across stores" },
  { value: "4.9", label: "Google rating", hint: "avg. across stores" },
] as const;

export const PLATFORMS = [
  "Shopify",
  "Wix",
  "WooCommerce",
  "Magento",
  "BigCommerce",
] as const;

export const CHAT_SCENARIOS = [
  {
    assis: [
      { text: "I noticed your order may be ", em: false },
      { text: "delayed", em: true },
      { text: ". I already checked it and pushed it for ", em: false },
      { text: "priority handling", em: true },
      { text: ". I'll keep you updated.", em: false },
    ],
    customer: "Thank you.\nI was just about to ask about it.",
    outcome: "DELAY HANDLED",
  },
  {
    assis: [
      { text: "Quick heads up. The size you ordered ", em: false },
      { text: "may not match", em: true },
      { text: " your mattress. Want me to fix it ", em: false },
      { text: "before it ships", em: true },
      { text: "?", em: false },
    ],
    customer: "Yes please.\nGood catch.",
    outcome: "ISSUE PREVENTED",
  },
  {
    assis: [
      { text: "I saw you were ", em: false },
      { text: "about to cancel", em: true },
      { text: " your order. Before you do, I can ", em: false },
      { text: "upgrade the shipping", em: true },
      { text: " and ", em: false },
      { text: "add a credit", em: true },
      { text: ". Want me to take care of it?", em: false },
    ],
    customer: "Okay.\nThat works for me.",
    outcome: "ORDER SAVED",
  },
] as const;

export const SHOPPER_REVIEWS = [
  {
    text: "Assis made my exchange so easy. I didn't have to wait for an email reply to get my new shipping label.",
    name: "Sarah M.",
    initials: "SM",
  },
  {
    text: "I got an answer in seconds—truly amazing service. Usually these things take days of back and forth.",
    name: "John D.",
    initials: "JD",
  },
  {
    text: "I love how I never have to repeat myself. They knew exactly which order I was talking about from the start.",
    name: "Emily R.",
    initials: "ER",
  },
  {
    text: "Found the perfect size thanks to the instant response. No more guessing games or return anxiety.",
    name: "Michael T.",
    initials: "MT",
  },
] as const;

export const WITHOUT_ASSIS = [
  "Customers wait hours for a reply.",
  "Customers repeat themselves again and again.",
  "Customers cancel and leave bad reviews.",
  "You spend your day putting out fires.",
] as const;

export const WITH_ASSIS = [
  "Customers get answers in seconds.",
  "Customers are already known.",
  "Customers stay and come back.",
  "You focus on growing your business.",
] as const;

export const HOW_STEPS = [
  {
    step: "01 Connect",
    title: "Connect your store.",
    desc: "Takes a few minutes. No setup. Works with Shopify, WooCommerce, and Wix.",
    icons: ["shopping_cart", "storefront", "apps"],
  },
  {
    step: "02 Assis handles it",
    title: "The AI+Human Loop.",
    desc: "Questions, delays, returns, issues — handled automatically. 24/7. Even at 3am while you sleep.",
  },
  {
    step: "03 You grow",
    title: "Scale effortlessly.",
    desc: "Less cancellations. Less support work. More repeat buyers. You wake up to sales, not problems.",
  },
] as const;

export const SCENARIOS = [
  {
    num: "01",
    title: "Wrong size → fixed before delivery",
    desc: "A customer almost ordered the wrong size. Assis detected it and fixed it before shipping.",
    icon: "check_circle",
    outcome: "No return. No frustration.",
    bgIcon: "straighten",
    width: "w-[450px]",
    mt: "",
  },
  {
    num: "02",
    title: "Delivery errors → supplier accountability",
    desc: "Multiple customers received wrong items. Assis identified the pattern and turned it into a structured report.",
    icon: "receipt_long",
    outcome: "The business got refunded.",
    bgIcon: null,
    width: "w-[550px]",
    mt: "mt-12",
  },
  {
    num: "03",
    title: "Pre-order confusion → order optimized",
    desc: "Customers delayed their own orders without knowing. Assis split shipments in real time.",
    icon: "rocket_launch",
    outcome: "Faster delivery. Fewer complaints.",
    bgIcon: "splitscreen",
    width: "w-[450px]",
    mt: "",
  },
  {
    num: "04",
    title: "Coupon bug → turned into loyalty",
    desc: "A checkout issue was detected. Assis resolved it instantly and upgraded the experience.",
    icon: "card_giftcard",
    outcome: "Customer stayed instead of leaving.",
    bgIcon: "confirmation_number",
    width: "w-[500px]",
    mt: "mt-6",
  },
  {
    num: "05",
    title: "Out of stock → recovered revenue",
    desc: "Customers who left were tracked. Assis reached out automatically when items returned.",
    icon: "trending_up",
    outcome: "Lost demand turned into sales.",
    bgIcon: "inventory_2",
    width: "w-[450px]",
    mt: "mt-16",
  },
  {
    num: "06",
    title: "Delay detected → compensation applied",
    desc: "Shipment delays identified early. Assis applied compensation before the customer could complain.",
    icon: "verified_user",
    outcome: "Escalations prevented.",
    bgIcon: "alarm_on",
    width: "w-[450px]",
    mt: "",
  },
] as const;

export const RESULT_HIGHLIGHTS = [
  "Fewer cancellations",
  "Fewer returns",
  "Less time answering customers",
  "More repeat buyers",
] as const;

export const RESULT_METRICS = [
  {
    value: "86%",
    label: "Revenue at risk — saved.",
    desc: "Sales that would have been lost without immediate intervention.",
    highlight: false,
  },
  {
    value: "< 1%",
    label: "Issues that escalate.",
    desc: "Problems get solved before they become complaints or tickets.",
    highlight: false,
  },
  {
    value: "6x",
    label: "Average ROI.",
    desc: "For every $1 spent on Assis, stores get $6 back in recovered revenue.",
    highlight: false,
  },
  {
    value: "24/7",
    label: "Always on.",
    desc: "Your customers never wait. Morning, noon, or midnight.",
    highlight: true,
  },
] as const;

export const MERCHANT_STORIES = [
  {
    quote:
      "Assis gave us the freedom to focus on growing Roomi. They protect our revenue and remove the operational noise, turning every interaction into a trusted relationship outcome.",
    name: "Bar Cohen",
    title: "Founder at Roomi",
    category: "Home & Bedding",
    categoryColor: "bg-[hsl(var(--primary-fixed)/0.3)] text-[hsl(var(--on-primary-fixed))]",
    image: "/base44/1ab9f7317_image.png",
    logo: "/brand/roomi-logo.png",
    logoHeight: 28,
  },
  {
    quote:
      "Customers used to wait hours for answers on technical questions. Now they get help in seconds. Returns dropped. Reviews improved. Simple as that.",
    name: "Eden Bachman",
    title: "COO at SHARP",
    category: "Electronics",
    categoryColor: "bg-[hsl(var(--secondary-fixed)/0.3)] text-[hsl(var(--on-secondary-fixed))]",
    image: "/base44/49476b987_image.png",
    logo: "/brand/sharp-logo.png",
    logoHeight: 18,
    highlight: "43% of sales conversations converted",
  },
  {
    quote:
      "In luxury, the experience is everything. Assis makes sure every customer feels known from the first click. That's how you build loyalty.",
    name: "Yovel Golan",
    title: "Founder at Swift",
    category: "Fashion & Luxury",
    categoryColor: "bg-[hsl(var(--tertiary-fixed)/0.3)] text-[hsl(var(--on-tertiary-fixed))]",
    image: "/base44/c390269ec_image.png",
    logo: "/brand/warmintro-logo.png",
    logoHeight: 26,
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: "What does Assis actually do for my store?",
    a: "Assis sits between your store and your shoppers. It handles sales questions before checkout, order issues after purchase, and turns conversations into growth. You keep running the store. Assis owns the customer side.",
  },
  {
    q: "What's the difference between Powered, Trusted, and Grow?",
    a: "Powered = AI automation while you keep your team. Trusted = Assis becomes your customer care team (fully managed). Grow = turn every conversation into revenue insights and actions. Start where you are. Upgrade when you're ready.",
  },
  {
    q: "Is this a chatbot?",
    a: "No. Chatbots answer questions. Assis protects revenue. A shopper hesitates — Assis steps in. Delivery delayed — Assis tells them before they ask. Something breaks — Assis fixes it before it becomes a bad review.",
  },
  {
    q: "Who responds to customers?",
    a: "AI and humans together. AI handles the volume. Humans handle judgment. In Trusted, Assis specialists own the queue. In Powered, your team gets handoff when needed.",
  },
  {
    q: "How fast can I get started?",
    a: "Shopify stores can connect in minutes. Live answers can start within days — not weeks of onboarding. Other platforms via demo.",
  },
  {
    q: "What results can I expect?",
    a: "Stores using Assis see ~6x average ROI, 86% of at-risk revenue saved, and ~43% conversion on sales conversations. Fewer cancellations. Fewer refunds. More repeat buyers.",
  },
] as const;
