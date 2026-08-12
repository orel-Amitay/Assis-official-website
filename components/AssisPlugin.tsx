"use client";

import { useEffect } from "react";

const PLUGIN_SCRIPT_URL =
  "https://rogistermaureen.github.io/github-pages/assis-plugin/index-assis-plugin-v2.js";
const PLUGIN_STYLE_URL =
  "https://rogistermaureen.github.io/github-pages/assis-plugin/style-assis-plugin-v2.css";
const PLUGIN_MOUNT_ID = "assis-plugin-app";
const PLUGIN_SCRIPT_ID = "assis-plugin-script";
const PLUGIN_STYLE_ID = "assis-plugin-style";
const PLUGIN_SITE_STYLE_ID = "assis-plugin-site-style";
const CHAT_PROMO_STYLE_ID = "assis-site-chat-promo-style";
const CHAT_PROMO_ROOT_ID = "assis-site-chat-promo";
const STARTER_STYLE_ID = "assis-site-starter-style";
const STARTER_ROOT_ID = "assis-site-starter-prompts";
const STARTER_DISMISS_KEY = "assis-site-starter-dismissed-v1";

const STARTER_PROMPTS = [
  "How does Assis work?",
  "What packages do you offer?",
  "Can I book a demo?",
] as const;

const CHAT_PROMO_SLIDES = [
  {
    tone: "blue",
    text: "More revenue starts with better customer relationships",
    icon: "spark",
  },
  {
    tone: "blue",
    text: "6X average ROI with Assis",
    icon: "spark",
  },
  {
    tone: "blue",
    text: "43% conversion lift in pre-purchase moments",
    icon: "spark",
  },
  {
    tone: "whatsapp",
    text: "Also available on WhatsApp",
    icon: "whatsapp",
  },
  {
    tone: "blue",
    text: "Ask Assis anything — or book a demo",
    icon: "spark",
  },
] as const;

const PROMO_ICONS: Record<(typeof CHAT_PROMO_SLIDES)[number]["icon"], string> = {
  whatsapp: `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="#25D366" d="M12.04 2C6.58 2 2.15 6.36 2.15 11.72c0 1.92.52 3.73 1.43 5.3L2 22l5.17-1.5a10.1 10.1 0 0 0 4.87 1.24c5.46 0 9.89-4.36 9.89-9.72C21.93 6.36 17.5 2 12.04 2zm5.77 13.8c-.24.67-1.18 1.23-1.93 1.4-.51.11-1.18.2-3.43-.73-2.88-1.2-4.74-4.14-4.88-4.33-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.56-.35.75-.35h.54c.17 0 .4-.06.62.47.24.58.8 2 .87 2.14.07.14.12.31.02.5-.1.19-.14.31-.28.48-.14.17-.3.37-.42.5-.14.14-.29.29-.12.56.17.28.74 1.22 1.59 1.97 1.1.98 2.02 1.28 2.3 1.42.29.14.45.12.62-.07.17-.19.71-.83.9-1.11.19-.28.38-.23.64-.14.26.1 1.66.78 1.95.92.28.14.47.21.54.33.07.12.07.67-.17 1.34z"/></svg>`,
  spark: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#1d6fee" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3.2"/></svg>`,
};

function ensureMountElement() {
  let mount = document.getElementById(PLUGIN_MOUNT_ID);

  if (!mount) {
    mount = document.createElement("div");
    mount.id = PLUGIN_MOUNT_ID;
    document.body.appendChild(mount);
  }

  mount.dataset.businessName = "";
  mount.dataset.heartPosition = "right";
  mount.dataset.heartSize = "small";
  mount.dataset.loginChannels = "ai";
  mount.dataset.direction = "ltr";
  mount.dataset.language = "en";
  mount.dataset.buttonLabel = "Need help?";
  mount.dataset.businessLogo = `${window.location.origin}/brand/assis-heart-chat.png`;
  mount.dataset.phonePrefix = "1";
  mount.dataset.assisBackendUrl = "https://backend.assis.care";
  mount.dataset.communicationChannels = ["whatsapp"].toString();
  mount.dataset.shouldBeOpenedOnDesktopOnLoad = String(true);

  return mount;
}

function loadAssisPluginStyles() {
  if (document.getElementById(PLUGIN_STYLE_ID)) {
    return;
  }

  const link = document.createElement("link");
  link.id = PLUGIN_STYLE_ID;
  link.rel = "stylesheet";
  link.href = PLUGIN_STYLE_URL;
  document.head.appendChild(link);
}

function loadSitePluginTweaks() {
  if (document.getElementById(PLUGIN_SITE_STYLE_ID)) {
    return;
  }

  const logoUrl = `${window.location.origin}/brand/assis-heart-chat.png`;

  const style = document.createElement("style");
  style.id = PLUGIN_SITE_STYLE_ID;
  style.textContent = `
    .welcome-subtitle {
      display: none !important;
    }

    /* Slightly smaller heart logo in the chat header */
    .header-logo {
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
      flex-shrink: 0 !important;
    }
    .header-logo img {
      width: 32px !important;
      height: 32px !important;
      max-width: 32px !important;
      max-height: 32px !important;
      object-fit: contain !important;
      display: block !important;
    }

    /* Prefer demo-style rotating strip over stock Assis banner */
    .chat-header-banner {
      display: none !important;
    }

    .fixed-heart-btn svg.heart-image {
      background: url("${logoUrl}") center / contain no-repeat !important;
    }
    .fixed-heart-btn svg.heart-image * {
      opacity: 0 !important;
    }
    .fixed-heart-btn img.heart-image-override {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
    }

    .fixed-heart-btn {
      width: 84px !important;
      height: 84px !important;
      animation: assis-heart-pulse 0.86s ease-in-out infinite !important;
      filter:
        drop-shadow(0 0 6px rgba(29, 111, 238, 0.35))
        drop-shadow(0 0 14px rgba(29, 111, 238, 0.22)) !important;
      transform-origin: center center;
      will-change: transform, filter;
    }

    .fixed-heart-btn img.heart-image-override,
    .fixed-heart-btn svg.heart-image {
      width: 68px !important;
      height: 68px !important;
    }

    .fixed-heart-btn:hover {
      filter:
        drop-shadow(0 0 8px rgba(29, 111, 238, 0.45))
        drop-shadow(0 0 18px rgba(29, 111, 238, 0.28)) !important;
    }

    @keyframes assis-heart-pulse {
      0%, 100% {
        transform: scale(0.88);
        filter:
          drop-shadow(0 0 5px rgba(29, 111, 238, 0.25))
          drop-shadow(0 0 10px rgba(29, 111, 238, 0.14));
      }
      50% {
        transform: scale(1);
        filter:
          drop-shadow(0 0 11px rgba(29, 111, 238, 0.52))
          drop-shadow(0 0 22px rgba(29, 111, 238, 0.32));
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .fixed-heart-btn {
        animation: none !important;
        transform: scale(0.88) !important;
      }
    }
  `;
  document.head.appendChild(style);
}

function injectChatPromoStyles() {
  if (document.getElementById(CHAT_PROMO_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = CHAT_PROMO_STYLE_ID;
  style.textContent = `
    #${CHAT_PROMO_ROOT_ID} {
      flex-shrink: 0;
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
      -webkit-user-select: none;
      user-select: none;
    }
    #${CHAT_PROMO_ROOT_ID} .assis-site-promo-link {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 7px 14px;
      text-decoration: none;
      border-bottom: 1px solid rgba(229, 231, 235, 0.9);
      cursor: default;
    }
    #${CHAT_PROMO_ROOT_ID} .assis-site-promo-link[data-tone="whatsapp"] {
      background: #eaf8ef;
      color: #166534;
    }
    #${CHAT_PROMO_ROOT_ID} .assis-site-promo-link[data-tone="blue"] {
      background: #f0f5ff;
      color: #1d6fee;
    }
    #${CHAT_PROMO_ROOT_ID} .assis-site-promo-icon {
      display: inline-flex;
      flex-shrink: 0;
      line-height: 0;
    }
    #${CHAT_PROMO_ROOT_ID} .assis-site-promo-text {
      margin: 0;
      font-size: 10.5px;
      font-weight: 400;
      line-height: 1.3;
      text-align: center;
    }
  `;
  document.head.appendChild(style);
}

function ensureChatPromoMounted(chat: HTMLElement) {
  injectChatPromoStyles();

  let root = document.getElementById(CHAT_PROMO_ROOT_ID);
  if (!root) {
    root = document.createElement("div");
    root.id = CHAT_PROMO_ROOT_ID;
    root.innerHTML = `
      <div class="assis-site-promo-link" data-tone="blue">
        <span class="assis-site-promo-icon" aria-hidden="true"></span>
        <p class="assis-site-promo-text"></p>
      </div>
    `;
  }

  if (root.parentElement !== chat) {
    const header =
      chat.querySelector(".v3-header") ||
      chat.querySelector(".chat-header") ||
      chat.firstElementChild;
    if (header) {
      header.insertAdjacentElement("afterend", root);
    } else {
      chat.prepend(root);
    }
  }

  return root;
}

function setupChatPromoBanner() {
  let slideIndex = 0;
  let rotateTimer: number | null = null;

  const renderSlide = (root: HTMLElement) => {
    const slide = CHAT_PROMO_SLIDES[slideIndex];
    if (!slide) return;
    const link = root.querySelector(".assis-site-promo-link") as HTMLElement | null;
    const icon = root.querySelector(".assis-site-promo-icon") as HTMLElement | null;
    const text = root.querySelector(".assis-site-promo-text") as HTMLElement | null;
    if (link) link.dataset.tone = slide.tone;
    if (icon) icon.innerHTML = PROMO_ICONS[slide.icon];
    if (text) text.textContent = slide.text;
  };

  const startRotation = (root: HTMLElement) => {
    if (rotateTimer != null) return;
    renderSlide(root);
    rotateTimer = window.setInterval(() => {
      slideIndex = (slideIndex + 1) % CHAT_PROMO_SLIDES.length;
      renderSlide(root);
    }, 4500);
  };

  const stopRotation = () => {
    if (rotateTimer == null) return;
    window.clearInterval(rotateTimer);
    rotateTimer = null;
  };

  const sync = () => {
    const chat = document.querySelector(
      ".chat-container-small, .chat-container-medium, .chat-container-large",
    ) as HTMLElement | null;

    if (!chat) {
      stopRotation();
      document.getElementById(CHAT_PROMO_ROOT_ID)?.remove();
      return;
    }

    const style = window.getComputedStyle(chat);
    if (style.display === "none" || style.visibility === "hidden") {
      stopRotation();
      document.getElementById(CHAT_PROMO_ROOT_ID)?.remove();
      return;
    }

    const root = ensureChatPromoMounted(chat);
    startRotation(root);
  };

  const observer = new MutationObserver(sync);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"],
  });

  const timers = [400, 1000, 2000, 4000].map((ms) => window.setTimeout(sync, ms));

  return () => {
    observer.disconnect();
    stopRotation();
    timers.forEach((id) => window.clearTimeout(id));
    document.getElementById(CHAT_PROMO_ROOT_ID)?.remove();
    document.getElementById(CHAT_PROMO_STYLE_ID)?.remove();
  };
}

function replacePluginHeartIcon() {
  const logoUrl = `${window.location.origin}/brand/assis-heart-chat.png`;

  const swap = () => {
    const btn = document.querySelector(".fixed-heart-btn");
    if (!btn) return false;

    const existing = btn.querySelector("img.heart-image-override");
    if (existing) return true;

    const svg = btn.querySelector("svg.heart-image");
    if (!svg) return false;

    const img = document.createElement("img");
    img.className = "heart-image heart-image-override";
    img.src = logoUrl;
    img.alt = "Assis";
    img.width = 68;
    img.height = 68;
    svg.replaceWith(img);
    return true;
  };

  if (swap()) return;

  const observer = new MutationObserver(() => {
    if (swap()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 15000);
}

type AssisVueProxy = {
  sendQuickAction?: (message: string) => void | Promise<void>;
  toggleChat?: () => void | Promise<void>;
  isChatOpen?: boolean;
};

function findAssisVueProxy(): AssisVueProxy | null {
  const roots = [
    document.getElementById("assis-plugin-app-root"),
    document.getElementById(PLUGIN_MOUNT_ID),
  ].filter(Boolean) as HTMLElement[];

  for (const root of roots) {
    const fromApp = (
      root as HTMLElement & {
        __vue_app__?: { _instance?: { proxy?: unknown } };
      }
    ).__vue_app__?._instance?.proxy;
    if (fromApp) return fromApp as AssisVueProxy;

    const fromParent = (
      root as HTMLElement & {
        __vueParentComponent?: { proxy?: unknown };
      }
    ).__vueParentComponent?.proxy;
    if (fromParent) return fromParent as AssisVueProxy;
  }

  const heart = document.querySelector(".fixed-heart-btn");
  let node: Element | null = heart;
  while (node) {
    const parent = (
      node as Element & {
        __vueParentComponent?: { proxy?: unknown };
      }
    ).__vueParentComponent?.proxy;
    if (parent) return parent as AssisVueProxy;
    node = node.parentElement;
  }

  return null;
}

function isAssisChatVisiblyOpen() {
  return Array.from(
    document.querySelectorAll(
      ".chat-container-small, .chat-container-medium, .chat-container-large",
    ),
  ).some((el) => {
    const node = el as HTMLElement;
    const style = window.getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity) > 0.05 &&
      rect.width > 40 &&
      rect.height > 80
    );
  });
}

async function sendStarterPrompt(message: string) {
  const starterRoot = document.getElementById(STARTER_ROOT_ID);
  if (starterRoot) starterRoot.dataset.hidden = "true";

  const trySendInOpenChat = async () => {
    const proxy = findAssisVueProxy();
    if (proxy?.sendQuickAction) {
      await proxy.sendQuickAction(message);
      return true;
    }

    const input = document.querySelector(
      ".chat-input, textarea",
    ) as HTMLTextAreaElement | null;
    if (!input) return false;

    const setter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value",
    )?.set;
    setter?.call(input, message);
    input.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        composed: true,
        data: message,
        inputType: "insertText",
      }),
    );

    const sendBtn = document.querySelector(
      ".send-btn:not([disabled])",
    ) as HTMLButtonElement | null;
    if (sendBtn) {
      sendBtn.click();
      return true;
    }
    return false;
  };

  if (isAssisChatVisiblyOpen()) {
    for (let attempt = 0; attempt < 12; attempt++) {
      if (await trySendInOpenChat()) return;
      await new Promise((resolve) => window.setTimeout(resolve, 100));
    }
    return;
  }

  const proxy = findAssisVueProxy();
  if (proxy?.sendQuickAction) {
    await proxy.sendQuickAction(message);
    return;
  }

  const heart = document.querySelector(
    ".fixed-heart-btn",
  ) as HTMLButtonElement | null;
  heart?.click();

  for (let attempt = 0; attempt < 20; attempt++) {
    await new Promise((resolve) => window.setTimeout(resolve, 120));
    if (await trySendInOpenChat()) return;
  }
}

function injectStarterPromptStyles() {
  if (document.getElementById(STARTER_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STARTER_STYLE_ID;
  style.textContent = `
    #${STARTER_ROOT_ID} {
      position: fixed;
      right: 20px;
      bottom: 118px;
      z-index: 2147482000;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 5px;
      max-width: min(280px, calc(100vw - 36px));
      pointer-events: none;
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    }
    #${STARTER_ROOT_ID}[data-hidden="true"] {
      display: none;
    }
    /* Replace built-in Assis "How can I help?" bubble */
    .quick-actions .ai-single-quick-bubble,
    .quick-actions .ai-single-quick-bubble-wrap,
    .quick-actions .quick-actions-tail--ai {
      display: none !important;
    }
    #${STARTER_ROOT_ID} .assis-site-starter-label-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
      width: 100%;
      pointer-events: none;
    }
    #${STARTER_ROOT_ID} .assis-site-starter-label {
      margin: 0;
      font-size: 9px;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #9ca3af;
    }
    #${STARTER_ROOT_ID} .assis-site-starter-close {
      pointer-events: auto;
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 999px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: #ffffff;
      color: #9ca3af;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(15, 18, 22, 0.1);
    }
    #${STARTER_ROOT_ID} .assis-site-starter-close svg {
      width: 9px;
      height: 9px;
    }
    #${STARTER_ROOT_ID} .assis-site-starter-btn {
      position: relative;
      pointer-events: auto;
      appearance: none;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: #ffffff;
      color: #374151;
      border-radius: 999px;
      padding: 6px 11px;
      font-size: 11px;
      font-weight: 500;
      line-height: 1.25;
      text-align: left;
      cursor: pointer;
      width: max-content;
      white-space: nowrap;
      box-shadow: 0 5px 16px rgba(15, 18, 22, 0.14);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    #${STARTER_ROOT_ID} .assis-site-starter-btn:hover {
      transform: translateY(-1px);
      color: #111;
      box-shadow: 0 6px 18px rgba(15, 18, 22, 0.16);
    }
    #${STARTER_ROOT_ID} .assis-site-starter-btn[data-assis-site-prompt-index="2"] {
      border-radius: 14px 14px 6px 14px;
      margin-bottom: 6px;
      overflow: visible;
    }
    #${STARTER_ROOT_ID} .assis-site-starter-btn[data-assis-site-prompt-index="2"]::after {
      content: "";
      position: absolute;
      left: var(--assis-tail-left, 50%);
      top: calc(100% - 1px);
      width: 14px;
      height: 8px;
      transform: translateX(-50%);
      background: #fff;
      clip-path: polygon(12% 0, 88% 0, 50% 100%);
      filter: drop-shadow(0 0.5px 0.4px rgba(0, 0, 0, 0.05));
      pointer-events: none;
    }
    #${STARTER_ROOT_ID}[data-collapsed="true"] .assis-site-starter-label-row,
    #${STARTER_ROOT_ID}[data-collapsed="true"] .assis-site-starter-btn:not(.assis-site-starter-collapsed) {
      display: none;
    }
    #${STARTER_ROOT_ID} .assis-site-starter-collapsed {
      display: none;
    }
    #${STARTER_ROOT_ID}[data-collapsed="true"] .assis-site-starter-collapsed {
      display: inline-flex;
      border-radius: 14px 14px 6px 14px;
      margin-bottom: 6px;
      overflow: visible;
    }
    #${STARTER_ROOT_ID}[data-collapsed="true"] .assis-site-starter-collapsed::after {
      content: "";
      position: absolute;
      left: var(--assis-tail-left, 50%);
      top: calc(100% - 1px);
      width: 14px;
      height: 8px;
      transform: translateX(-50%);
      background: #fff;
      clip-path: polygon(12% 0, 88% 0, 50% 100%);
      filter: drop-shadow(0 0.5px 0.4px rgba(0, 0, 0, 0.05));
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
}

function positionStarterPromptsAboveHeart(root: HTMLElement) {
  const heart = document.querySelector(".fixed-heart-btn") as HTMLElement | null;
  if (!heart) {
    root.style.right = "20px";
    root.style.bottom = "118px";
    return;
  }

  // Layout size + CSS insets only — ignore pulse transform so bubbles don't jitter
  const cs = window.getComputedStyle(heart);
  const heartRight = cs.right !== "auto" ? cs.right : "20px";
  const heartBottomPx = Number.parseFloat(cs.bottom) || 20;
  const gap = 10;
  const bottom = heartBottomPx + heart.offsetHeight + gap;

  root.style.right = heartRight;
  root.style.bottom = `${Math.round(bottom)}px`;

  const tailBtn = root.querySelector(
    root.dataset.collapsed === "true"
      ? ".assis-site-starter-collapsed"
      : '[data-assis-site-prompt-index="2"]',
  ) as HTMLElement | null;
  if (!tailBtn) return;

  const heartLayoutCenterX =
    window.innerWidth -
    (Number.parseFloat(heartRight) || 20) -
    heart.offsetWidth / 2;
  const btnRect = tailBtn.getBoundingClientRect();
  const clamped = Math.min(
    Math.max(heartLayoutCenterX - btnRect.left, 18),
    Math.max(18, btnRect.width - 18),
  );
  tailBtn.style.setProperty("--assis-tail-left", `${Math.round(clamped)}px`);
}

function syncStarterPromptVisibility(root: HTMLElement) {
  if (isAssisChatVisiblyOpen()) {
    root.dataset.hidden = "true";
    return;
  }

  root.dataset.hidden = "false";
  try {
    if (sessionStorage.getItem(STARTER_DISMISS_KEY) === "1") {
      root.dataset.collapsed = "true";
    }
  } catch {
    /* ignore */
  }
  positionStarterPromptsAboveHeart(root);
}

function setupStarterPrompts() {
  injectStarterPromptStyles();

  document.getElementById(STARTER_ROOT_ID)?.remove();

  const root = document.createElement("div");
  root.id = STARTER_ROOT_ID;

  let collapsed = false;
  try {
    collapsed = sessionStorage.getItem(STARTER_DISMISS_KEY) === "1";
  } catch {
    /* ignore */
  }
  if (collapsed) root.dataset.collapsed = "true";

  const labelRow = document.createElement("div");
  labelRow.className = "assis-site-starter-label-row";

  const label = document.createElement("p");
  label.className = "assis-site-starter-label";
  label.textContent = "Try asking";
  labelRow.appendChild(label);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "assis-site-starter-close";
  closeBtn.setAttribute("aria-label", "Dismiss suggestions");
  closeBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M18 6 6 18"/>
      <path d="M6 6 18 18"/>
    </svg>
  `;
  labelRow.appendChild(closeBtn);
  root.appendChild(labelRow);

  STARTER_PROMPTS.forEach((prompt, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "assis-site-starter-btn";
    button.dataset.assisSitePromptIndex = String(index);
    button.textContent = prompt;
    root.appendChild(button);
  });

  const collapsedBtn = document.createElement("button");
  collapsedBtn.type = "button";
  collapsedBtn.className = "assis-site-starter-btn assis-site-starter-collapsed";
  collapsedBtn.textContent = "Ask Assis";
  root.appendChild(collapsedBtn);

  document.body.appendChild(root);

  const onClick = (event: MouseEvent) => {
    const target = event.target as Element | null;
    if (target?.closest(".assis-site-starter-close")) {
      try {
        sessionStorage.setItem(STARTER_DISMISS_KEY, "1");
      } catch {
        /* ignore */
      }
      root.dataset.collapsed = "true";
      positionStarterPromptsAboveHeart(root);
      return;
    }

    if (target?.closest(".assis-site-starter-collapsed")) {
      void sendStarterPrompt("Can I book a demo?");
      return;
    }

    const btn = target?.closest(
      ".assis-site-starter-btn[data-assis-site-prompt-index]",
    ) as HTMLElement | null;
    if (!btn) return;
    const index = Number(btn.dataset.assisSitePromptIndex);
    const message = STARTER_PROMPTS[index];
    if (message) void sendStarterPrompt(message);
  };

  root.addEventListener("click", onClick);

  let raf = 0;
  let lastOpen: boolean | null = null;
  const syncVisibility = () => {
    if (raf) return;
    raf = window.requestAnimationFrame(() => {
      raf = 0;
      const open = isAssisChatVisiblyOpen();
      const openChanged = lastOpen !== open;
      lastOpen = open;

      if (open) {
        root.dataset.hidden = "true";
        return;
      }

      root.dataset.hidden = "false";
      try {
        if (sessionStorage.getItem(STARTER_DISMISS_KEY) === "1") {
          root.dataset.collapsed = "true";
        }
      } catch {
        /* ignore */
      }
      // Only reposition when chat open/closed flips — not on every DOM mutation
      if (openChanged) positionStarterPromptsAboveHeart(root);
    });
  };

  const syncAndReposition = () => {
    lastOpen = null;
    syncStarterPromptVisibility(root);
  };

  const observer = new MutationObserver(syncVisibility);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"],
  });
  window.addEventListener("resize", syncAndReposition);
  const timers = [300, 900, 1800].map((ms) =>
    window.setTimeout(syncAndReposition, ms),
  );

  return () => {
    root.removeEventListener("click", onClick);
    observer.disconnect();
    window.removeEventListener("resize", syncAndReposition);
    if (raf) window.cancelAnimationFrame(raf);
    timers.forEach((id) => window.clearTimeout(id));
    root.remove();
    document.getElementById(STARTER_STYLE_ID)?.remove();
  };
}

function loadAssisPluginScript() {
  if (document.getElementById(PLUGIN_SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.id = PLUGIN_SCRIPT_ID;
  script.src = PLUGIN_SCRIPT_URL;
  script.async = true;
  document.body.appendChild(script);
}

export default function AssisPlugin() {
  useEffect(() => {
    ensureMountElement();
    loadAssisPluginStyles();
    loadSitePluginTweaks();
    loadAssisPluginScript();
    replacePluginHeartIcon();
    const cleanupPromo = setupChatPromoBanner();
    const cleanupStarters = setupStarterPrompts();
    return () => {
      cleanupPromo();
      cleanupStarters();
    };
  }, []);

  return null;
}
