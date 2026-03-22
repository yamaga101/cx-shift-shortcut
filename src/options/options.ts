import type { Binding, Settings } from "../types";

const DESC_MAP: Record<string, string> = {
  swap: "2つの選択範囲の値を入れ替えます",
  unassigned: "選択したシフトを未充当プールに移動",
  finalize: "選択範囲に確定マークを付与/解除",
};

let settings: Settings | null = null;
let captureTarget: number | null = null;

function formatKey(binding: Binding): string {
  const isMac = navigator.platform.includes("Mac");
  const parts: string[] = [];
  if (binding.meta) parts.push(isMac ? "\u2318" : "Ctrl");
  if (binding.ctrl && isMac) parts.push("\u2303");
  if (binding.alt) parts.push(isMac ? "\u2325" : "Alt");
  if (binding.shift) parts.push("\u21E7");
  parts.push(binding.key.toUpperCase());
  return parts.join(" + ");
}

function renderBindings(): void {
  const tbody = document.getElementById("bindingTableBody")!;
  tbody.innerHTML = "";

  settings!.bindings.forEach((binding, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="fn-name">${binding.label}</div>
        <div class="fn-desc">${DESC_MAP[binding.id] || ""}</div>
      </td>
      <td>
        <button class="key-cap" data-idx="${idx}">${formatKey(binding)}</button>
      </td>
      <td>
        <button class="btn-reset" data-idx="${idx}">リセット</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll<HTMLButtonElement>(".key-cap").forEach((btn) => {
    btn.addEventListener("click", () => {
      captureTarget = parseInt(btn.dataset.idx!);
      document.getElementById("capturedKeyDisplay")!.textContent = "";
      document.getElementById("keyCaptureModal")!.classList.add("active");
    });
  });

  tbody.querySelectorAll<HTMLButtonElement>(".btn-reset").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const idx = parseInt(btn.dataset.idx!);
      const defaults: Settings = await new Promise((resolve) =>
        chrome.runtime.sendMessage({ type: "resetSettings" }, resolve)
      );
      if (defaults.bindings[idx]) {
        settings!.bindings[idx] = { ...defaults.bindings[idx] };
        renderBindings();
        showToast("リセットしました");
      }
    });
  });
}

// ── Key Capture Modal ────────────────────────────────────────
document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (captureTarget === null) return;
  if (["Meta", "Control", "Alt", "Shift"].includes(e.key)) return;

  e.preventDefault();

  const isMac = navigator.platform.includes("Mac");
  const binding = settings!.bindings[captureTarget];

  binding.key = e.key.toLowerCase();
  binding.meta = isMac ? e.metaKey : e.ctrlKey;
  binding.ctrl = isMac ? e.ctrlKey : false;
  binding.alt = e.altKey;
  binding.shift = e.shiftKey;

  document.getElementById("capturedKeyDisplay")!.textContent =
    formatKey(binding);

  setTimeout(() => {
    document.getElementById("keyCaptureModal")!.classList.remove("active");
    captureTarget = null;
    renderBindings();
  }, 600);
});

document
  .getElementById("keyCaptureModal")!
  .addEventListener("click", (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      (e.currentTarget as HTMLElement).classList.remove("active");
      captureTarget = null;
    }
  });

// ── Save / Reset ─────────────────────────────────────────────
document
  .getElementById("btnSave")!
  .addEventListener("click", async () => {
    settings!.menuName = (
      document.getElementById("menuName") as HTMLInputElement
    ).value.trim();
    settings!.sheetsOnly = (
      document.getElementById("sheetsOnly") as HTMLInputElement
    ).checked;
    settings!.showToast = (
      document.getElementById("showToast") as HTMLInputElement
    ).checked;

    await chrome.runtime.sendMessage({ type: "saveSettings", settings });
    showToast("保存しました");
  });

document
  .getElementById("btnReset")!
  .addEventListener("click", async () => {
    settings = await new Promise((resolve) =>
      chrome.runtime.sendMessage({ type: "resetSettings" }, resolve)
    );
    renderAll();
    showToast("初期値に戻しました");
  });

// ── Toast ────────────────────────────────────────────────────
function showToast(msg: string): void {
  const el = document.getElementById("toast")!;
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2000);
}

// ── Init ─────────────────────────────────────────────────────
function renderAll(): void {
  (document.getElementById("menuName") as HTMLInputElement).value =
    settings!.menuName || "勤務表システム";
  (document.getElementById("sheetsOnly") as HTMLInputElement).checked =
    settings!.sheetsOnly !== false;
  (document.getElementById("showToast") as HTMLInputElement).checked =
    settings!.showToast !== false;
  renderBindings();
}

async function init(): Promise<void> {
  settings = await new Promise((resolve) =>
    chrome.runtime.sendMessage({ type: "getSettings" }, resolve)
  );
  renderAll();
}

init();
