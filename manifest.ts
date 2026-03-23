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
  key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAn7ExCmD/SY9so9O3Ags8aDUXuRJQVMWgaDJoWn1LOeI6a49zstN5dy4L3TpIs/fxa0HhMcFwGe8HhQA+7FShDv9RMXFIiGsArygcXYJHCbNHYfgDFaz9a00TuN/02jwTbN995hcg276KVRKHay7t6DPv46FoIA2/D3O0hRtSMemgfsgTMf2RPDXqEbHXdERii3rwlI5lNWWSw7mYZ3RXLSxofJ+hbxWFtjnqpxKzZZ8fGw420zdxo8P58tiA2JbbEUKecSlTKDhun/g8lBEv5u7Ycge5vpMUpSGZHER4e8dQBeqqCOCLq1RNcAw3KuZiP4Gp1YrXXJLkQjENVxCJ2QIDAQAB",
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
