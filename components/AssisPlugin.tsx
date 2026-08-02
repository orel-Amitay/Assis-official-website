"use client";

import { useEffect } from "react";

const PLUGIN_SCRIPT_URL =
  "https://rogistermaureen.github.io/github-pages/assis-plugin/index-assis-plugin-v2.js";
const PLUGIN_STYLE_URL =
  "https://rogistermaureen.github.io/github-pages/assis-plugin/style-assis-plugin-v2.css";
const PLUGIN_MOUNT_ID = "assis-plugin-app";
const PLUGIN_SCRIPT_ID = "assis-plugin-script";
const PLUGIN_STYLE_ID = "assis-plugin-style";
const LOCK_STYLE_ID = "assis-channel-lock-style";
const LOCK_MODAL_ID = "assis-channel-lock-modal";

const LOCKED_BUTTON_SELECTOR =
  ".ai-contact-channel-btn--whatsapp, .ai-contact-channel-btn--email";

const LOCK_ICON_SVG = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="5" y="11" width="14" height="10" rx="2"/>
    <path d="M8 11V8a4 4 0 0 1 8 0v3"/>
  </svg>
`;

function ensureMountElement() {
  let mount = document.getElementById(PLUGIN_MOUNT_ID);

  if (!mount) {
    mount = document.createElement("div");
    mount.id = PLUGIN_MOUNT_ID;
    document.body.appendChild(mount);
  }

  mount.dataset.businessName = "Tennis Club";
  mount.dataset.heartPosition = "right";
  mount.dataset.heartSize = "small";
  mount.dataset.loginChannels = "ai";
  mount.dataset.direction = "ltr";
  mount.dataset.language = "en";
  mount.dataset.buttonLabel = "Need help?";
  mount.dataset.businessLogo = `${window.location.origin}/brand/tennis-club-logo.png`;
  mount.dataset.phonePrefix = "1";
  mount.dataset.assisBackendUrl = "https://backend-dev.assis.care";
  mount.dataset.communicationChannels = "whatsapp,email";
  mount.dataset.shouldBeOpenedOnDesktopOnLoad = "true";

  return mount;
}

function loadAssisPluginStyles() {
  if (document.getElementById(PLUGIN_STYLE_ID)) return;

  const link = document.createElement("link");
  link.id = PLUGIN_STYLE_ID;
  link.rel = "stylesheet";
  link.href = PLUGIN_STYLE_URL;
  document.head.appendChild(link);
}

function loadAssisPluginScript() {
  if (document.getElementById(PLUGIN_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = PLUGIN_SCRIPT_ID;
  script.src = PLUGIN_SCRIPT_URL;
  script.async = true;
  document.body.appendChild(script);
}

function injectLockStyles() {
  if (document.getElementById(LOCK_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = LOCK_STYLE_ID;
  style.textContent = `
    ${LOCKED_BUTTON_SELECTOR}.assis-channel-locked {
      position: relative !important;
      cursor: pointer !important;
      opacity: 1 !important;
      background: #f7f7f8 !important;
      border-color: #e5e7eb !important;
      color: #6b7280 !important;
      box-shadow: none !important;
      filter: none !important;
    }
    ${LOCKED_BUTTON_SELECTOR}.assis-channel-locked:hover {
      background: #f3f4f6 !important;
      border-color: #d1d5db !important;
    }
    ${LOCKED_BUTTON_SELECTOR}.assis-channel-locked .ai-contact-channel-icon {
      opacity: 0.55 !important;
      filter: grayscale(1) !important;
    }
    ${LOCKED_BUTTON_SELECTOR}.assis-channel-locked .ai-contact-channel-label,
    ${LOCKED_BUTTON_SELECTOR}.assis-channel-locked {
      color: #6b7280 !important;
    }
    .assis-channel-lock-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      margin-left: 2px;
      border-radius: 999px;
      background: rgba(17, 17, 17, 0.06);
      color: #4b5563;
      flex-shrink: 0;
    }
    .assis-channel-lock-mark svg {
      width: 10px;
      height: 10px;
    }
    #${LOCK_MODAL_ID} {
      position: fixed;
      inset: 0;
      z-index: 2147483000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(15, 18, 22, 0.42);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
    #${LOCK_MODAL_ID}.is-open {
      display: flex;
    }
    #${LOCK_MODAL_ID} .assis-channel-lock-card {
      width: min(100%, 360px);
      border-radius: 20px;
      background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
      border: 1px solid rgba(0,0,0,0.06);
      padding: 28px 24px 22px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.22);
      text-align: center;
      font-family: "Figtree", system-ui, -apple-system, sans-serif;
    }
    #${LOCK_MODAL_ID} .assis-channel-lock-icon {
      width: 52px;
      height: 52px;
      margin: 0 auto 16px;
      border-radius: 16px;
      background: #111;
      color: #fff;
      display: grid;
      place-items: center;
    }
    #${LOCK_MODAL_ID} .assis-channel-lock-icon svg {
      width: 22px;
      height: 22px;
    }
    #${LOCK_MODAL_ID} .assis-channel-lock-eyebrow {
      margin: 0 0 8px;
      font-size: 11px;
      font-weight: 650;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #9ca3af;
    }
    #${LOCK_MODAL_ID} h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: #111;
    }
    #${LOCK_MODAL_ID} p {
      margin: 10px 0 0;
      font-size: 14px;
      line-height: 1.55;
      color: #6b7280;
    }
    #${LOCK_MODAL_ID} .assis-channel-lock-actions {
      display: grid;
      gap: 8px;
      margin-top: 20px;
    }
    #${LOCK_MODAL_ID} button {
      border: 0;
      border-radius: 999px;
      padding: 12px 16px;
      font-size: 13px;
      font-weight: 650;
      cursor: pointer;
      transition: transform 0.15s ease, background 0.15s ease;
    }
    #${LOCK_MODAL_ID} button:hover {
      transform: translateY(-1px);
    }
    #${LOCK_MODAL_ID} .assis-channel-lock-primary {
      background: #1d6fee;
      color: #fff;
    }
    #${LOCK_MODAL_ID} .assis-channel-lock-secondary {
      background: transparent;
      color: #6b7280;
    }
  `;
  document.head.appendChild(style);
}

function ensureLockModal() {
  let modal = document.getElementById(LOCK_MODAL_ID);
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = LOCK_MODAL_ID;
  modal.innerHTML = `
    <div class="assis-channel-lock-card" role="dialog" aria-modal="true" aria-labelledby="assis-channel-lock-title">
      <div class="assis-channel-lock-icon" aria-hidden="true">${LOCK_ICON_SVG}</div>
      <p class="assis-channel-lock-eyebrow">Assis Demo</p>
      <h2 id="assis-channel-lock-title">Channels are locked</h2>
      <p>
        WhatsApp and Email are available after you upgrade and install Assis channels.
        Unlock them to let customers continue the conversation where they already message you.
      </p>
      <div class="assis-channel-lock-actions">
        <button type="button" class="assis-channel-lock-primary" data-assis-channel-upgrade>
          Upgrade to unlock
        </button>
        <button type="button" class="assis-channel-lock-secondary" data-assis-channel-close>
          Maybe later
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (target === modal || target.closest("[data-assis-channel-close]")) {
      modal.classList.remove("is-open");
      return;
    }
    if (target.closest("[data-assis-channel-upgrade]")) {
      window.open("https://assis.care", "_blank", "noopener,noreferrer");
      modal.classList.remove("is-open");
    }
  });

  return modal;
}

function openLockModal() {
  ensureLockModal().classList.add("is-open");
}

function isLockedChannelTarget(el: Element | null) {
  if (!el) return false;
  return Boolean(el.closest?.(LOCKED_BUTTON_SELECTOR));
}

function lockChannelButtons(root: ParentNode = document) {
  const buttons = root.querySelectorAll?.(LOCKED_BUTTON_SELECTOR) ?? [];
  buttons.forEach((btn) => {
    const el = btn as HTMLElement;
    if (el.dataset.assisChannelLocked === "1") return;

    el.dataset.assisChannelLocked = "1";
    el.classList.add("assis-channel-locked");
    el.setAttribute("aria-disabled", "true");
    el.title = "Upgrade to unlock this channel";

    // Remove old bulky badge if present from previous version
    el.querySelectorAll(".assis-wa-lock-badge").forEach((node) => node.remove());

    if (!el.querySelector(".assis-channel-lock-mark")) {
      const mark = document.createElement("span");
      mark.className = "assis-channel-lock-mark";
      mark.innerHTML = LOCK_ICON_SVG;
      el.appendChild(mark);
    }
  });
}

function setupChannelLocks() {
  injectLockStyles();
  ensureLockModal();
  lockChannelButtons();

  const onClickCapture = (event: MouseEvent) => {
    const target = event.target as Element | null;
    if (!isLockedChannelTarget(target)) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openLockModal();
  };

  document.addEventListener("click", onClickCapture, true);

  const observer = new MutationObserver(() => {
    lockChannelButtons();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    document.removeEventListener("click", onClickCapture, true);
    observer.disconnect();
  };
}

export default function AssisPlugin() {
  useEffect(() => {
    ensureMountElement();
    loadAssisPluginStyles();
    loadAssisPluginScript();
    const cleanup = setupChannelLocks();
    return cleanup;
  }, []);

  return null;
}
