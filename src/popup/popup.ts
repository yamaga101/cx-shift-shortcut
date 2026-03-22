import type { Binding, Settings } from "../types";

interface IconMeta {
  icon: string;
  cls: string;
  badge: string;
  desc: string;
}

const ICON_MAP: Record<string, IconMeta> = {
  swap: {
    icon: "swap_horiz",
    cls: "swap",
    badge: "blue",
    desc: "2範囲の値を入替え",
  },
  unassigned: {
    icon: "arrow_downward",
    cls: "unassigned",
    badge: "green",
    desc: "シフトを未充当に移動",
  },
  finalize: {
    icon: "check_circle",
    cls: "finalize",
    badge: "orange",
    desc: "確定マーク付与/解除",
  },
};

function formatKey(binding: Binding): string {
  const parts: string[] = [];
  if (binding.meta)
    parts.push(navigator.platform.includes("Mac") ? "\u2318" : "Ctrl");
  if (binding.ctrl && navigator.platform.includes("Mac")) parts.push("\u2303");
  if (binding.alt)
    parts.push(navigator.platform.includes("Mac") ? "\u2325" : "Alt");
  if (binding.shift) parts.push("\u21E7");
  parts.push(binding.key.toUpperCase());
  return parts.join("");
}

async function render(): Promise<void> {
  const settings: Settings = await new Promise((resolve) =>
    chrome.runtime.sendMessage({ type: "getSettings" }, resolve)
  );

  const toggle = document.getElementById("toggle")!;
  const body = document.body;

  if (!settings.enabled) {
    toggle.classList.remove("on");
    body.classList.add("disabled");
  }

  toggle.addEventListener("click", async () => {
    settings.enabled = !settings.enabled;
    toggle.classList.toggle("on", settings.enabled);
    body.classList.toggle("disabled", !settings.enabled);
    await chrome.runtime.sendMessage({ type: "saveSettings", settings });
  });

  const list = document.getElementById("shortcutList")!;
  list.innerHTML = "";

  for (const binding of settings.bindings) {
    const meta: IconMeta = ICON_MAP[binding.id] || {
      icon: "keyboard",
      cls: "swap",
      badge: "blue",
      desc: "",
    };
    const card = document.createElement("div");
    card.className = "shortcut-card";
    card.innerHTML = `
      <div class="shortcut-icon ${meta.cls}">
        <span class="material-symbols-outlined">${meta.icon}</span>
      </div>
      <div class="shortcut-info">
        <div class="shortcut-name">${binding.label}</div>
        <div class="shortcut-desc">${meta.desc}</div>
      </div>
      <span class="key-badge ${meta.badge}">${formatKey(binding)}</span>
    `;
    list.appendChild(card);
  }

  document.getElementById("openOptions")!.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
}

render();
