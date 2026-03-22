import type { Binding, Settings, MessageType } from "../types";

const DEFAULT_BINDINGS: Binding[] = [
  {
    id: "swap",
    key: "e",
    meta: true,
    ctrl: false,
    alt: false,
    shift: false,
    label: "選択範囲を交換",
    menuItem: "選択範囲を交換",
  },
  {
    id: "unassigned",
    key: "w",
    meta: true,
    ctrl: false,
    alt: false,
    shift: false,
    label: "未充当に落とす",
    menuItem: "未充当に落とす",
  },
  {
    id: "finalize",
    key: "q",
    meta: true,
    ctrl: false,
    alt: false,
    shift: false,
    label: "確定マーク",
    menuItem: "確定マーク",
  },
];

const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  menuName: "勤務表システム",
  showToast: true,
  sheetsOnly: true,
  bindings: DEFAULT_BINDINGS,
};

chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.sync.get("settings");
  if (!stored.settings) {
    await chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
  }
});

chrome.runtime.onMessage.addListener(
  (msg: MessageType, _sender, sendResponse) => {
    if (msg.type === "getSettings") {
      chrome.storage.sync.get("settings").then(({ settings }) => {
        sendResponse(settings || DEFAULT_SETTINGS);
      });
      return true;
    }
    if (msg.type === "saveSettings") {
      chrome.storage.sync.set({ settings: msg.settings }).then(() => {
        chrome.tabs.query(
          { url: "https://docs.google.com/spreadsheets/*" },
          (tabs) => {
            for (const tab of tabs) {
              if (tab.id) {
                chrome.tabs
                  .sendMessage(tab.id, {
                    type: "settingsUpdated",
                    settings: msg.settings,
                  })
                  .catch(() => {});
              }
            }
          }
        );
        sendResponse({ ok: true });
      });
      return true;
    }
    if (msg.type === "resetSettings") {
      chrome.storage.sync.set({ settings: DEFAULT_SETTINGS }).then(() => {
        sendResponse(DEFAULT_SETTINGS);
      });
      return true;
    }
  }
);
