import type { Settings } from "../types";

(() => {
  "use strict";

  let settings: Settings | null = null;

  // ── Load settings ──────────────────────────────────────────
  async function loadSettings(): Promise<Settings> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: "getSettings" }, (s: Settings) => {
        settings = s;
        resolve(s);
      });
    });
  }

  // ── Listen for settings updates ────────────────────────────
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "settingsUpdated") {
      settings = msg.settings;
    }
  });

  // ── Find and click a menu item in Google Sheets DOM ────────
  async function clickMenuItem(
    menuName: string,
    itemText: string
  ): Promise<boolean> {
    const menuBar = document.getElementById("docs-menubars");
    if (!menuBar) {
      showToast("メニューバーが見つかりません", true);
      return false;
    }

    const menus = menuBar.querySelectorAll(
      ".menu-label, .goog-control-content"
    );
    let topMenu: Element | null = null;
    for (const m of menus) {
      if (m.textContent?.trim() === menuName) {
        topMenu = m;
        break;
      }
    }

    if (!topMenu) {
      const allMenus = menuBar.querySelectorAll(
        '[role="menuitem"], [class*="menu"]'
      );
      for (const m of allMenus) {
        if (m.textContent?.trim() === menuName) {
          topMenu = m;
          break;
        }
      }
    }

    if (!topMenu) {
      showToast(`メニュー「${menuName}」が見つかりません`, true);
      return false;
    }

    topMenu.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    topMenu.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    topMenu.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    await sleep(200);

    const menuItems = document.querySelectorAll(
      '.goog-menuitem-content, .apps-menuitem-label, [role="menuitem"] .goog-menuitem-content'
    );
    let targetItem: Element | null = null;
    for (const item of menuItems) {
      if (item.textContent?.trim().includes(itemText)) {
        targetItem = item.closest('.goog-menuitem, [role="menuitem"]') || item;
        break;
      }
    }

    if (!targetItem) {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      );
      showToast(`メニュー項目「${itemText}」が見つかりません`, true);
      return false;
    }

    targetItem.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    targetItem.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    targetItem.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    return true;
  }

  // ── Keyboard event handler ─────────────────────────────────
  function handleKeyDown(e: KeyboardEvent): void {
    if (!settings?.enabled) return;
    if (!settings.bindings?.length) return;

    const active = document.activeElement as HTMLElement | null;
    if (
      active &&
      (active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.isContentEditable)
    ) {
      const isSheetEditor = active.closest(
        ".cell-input, .waffle-cell-editor, #t-formula-bar-input"
      );
      if (!isSheetEditor) return;
    }

    const isMac = navigator.platform.includes("Mac");

    for (const binding of settings.bindings) {
      const metaMatch = isMac
        ? binding.meta
          ? e.metaKey
          : !e.metaKey
        : binding.meta
          ? e.ctrlKey
          : !e.ctrlKey;
      const ctrlMatch = isMac
        ? binding.ctrl
          ? e.ctrlKey
          : !e.ctrlKey
        : true;
      const altMatch = binding.alt ? e.altKey : !e.altKey;
      const shiftMatch = binding.shift ? e.shiftKey : !e.shiftKey;
      const keyMatch = e.key.toLowerCase() === binding.key.toLowerCase();

      if (keyMatch && metaMatch && ctrlMatch && altMatch && shiftMatch) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (settings.showToast) {
          showToast(`${binding.label} を実行中...`);
        }

        clickMenuItem(settings.menuName, binding.menuItem).then((ok) => {
          if (ok && settings?.showToast) {
            setTimeout(
              () => showToast(`${binding.label} — 完了`, false, 1500),
              500
            );
          }
        });

        return;
      }
    }
  }

  // ── Toast notification ─────────────────────────────────────
  let toastEl: HTMLDivElement | null = null;
  let toastTimer: ReturnType<typeof setTimeout> | null = null;

  function showToast(
    message: string,
    isError = false,
    duration = 3000
  ): void {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.id = "shift-shortcut-toast";
      toastEl.style.cssText = `
        position: fixed; bottom: 24px; right: 24px; z-index: 999999;
        padding: 12px 20px; border-radius: 8px;
        font-family: 'Noto Sans JP', sans-serif; font-size: 14px;
        color: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        transition: opacity 0.3s, transform 0.3s;
        opacity: 0; transform: translateY(10px);
      `;
      document.body.appendChild(toastEl);
    }

    toastEl.textContent = message;
    toastEl.style.background = isError ? "#c62828" : "#1a237e";
    toastEl.style.opacity = "1";
    toastEl.style.transform = "translateY(0)";

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      if (toastEl) {
        toastEl.style.opacity = "0";
        toastEl.style.transform = "translateY(10px)";
      }
    }, duration);
  }

  // ── Utility ────────────────────────────────────────────────
  function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }

  // ── Initialize ─────────────────────────────────────────────
  async function init(): Promise<void> {
    await loadSettings();
    document.addEventListener("keydown", handleKeyDown, true);
    console.log(
      "[勤務表ショートカット] Loaded.",
      settings?.bindings?.length,
      "bindings active."
    );
  }

  init();
})();
