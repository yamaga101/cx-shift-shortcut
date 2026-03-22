import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "勤務表ショートカット",
  description:
    "Google Sheetsの勤務表システムにカスタムキーボードショートカットを追加",
  version: "1.2.0",
  icons: {
    "16": "public/icons/icon16.png",
    "48": "public/icons/icon48.png",
    "128": "public/icons/icon128.png",
  },
  permissions: ["storage", "activeTab"],
  action: {
    default_popup: "src/popup/index.html",
    default_icon: {
      "16": "public/icons/icon16.png",
      "48": "public/icons/icon48.png",
    },
  },
  options_ui: {
    page: "src/options/index.html",
    open_in_tab: true,
  },
  content_scripts: [
    {
      matches: ["https://docs.google.com/spreadsheets/*"],
      js: ["src/content/content.ts"],
      run_at: "document_idle",
    },
  ],
  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module",
  },
});
