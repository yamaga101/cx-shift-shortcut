# cx-shift-shortcut

## Purpose
Google Sheetsの勤務表システム（GASカスタムメニュー）にキーボードショートカットを追加するChrome拡張。
bus-driver-work-status プロジェクトのGASメニュー操作（スワップ・未充当・確定マーク）をDOM経由で自動クリックする。

## Architecture
- **Runtime**: Chrome Extension Manifest V3
- **Build**: Vite + @crxjs/vite-plugin + TypeScript
- **Source**: `src/` (manifest.ts, background/, content/, popup/, options/)
- **Output**: `dist/` → Chrome に読み込む
- **Icons**: `public/icons/`

## Status
stable — v1.0.0

## Key Decisions
1. **DOM menu click 方式**: GAS sidebar や synthetic keydown は Google Sheets のセキュリティ制約で不可。メニューバーDOM要素を直接クリックする方式を採用
2. **CRXJS + Vite**: 他のcx-プロジェクト（cx-sheets等）と同じビルドパイプライン
3. **chrome.storage.sync**: キーバインド設定をクラウド同期

## Access
- 特別な権限不要（storage, activeTab のみ）
- 対象: `https://docs.google.com/spreadsheets/*`

## Deploy
1. `npm run build` → `dist/` 生成
2. Chrome: `chrome://extensions` → デベロッパーモード → `dist/` を読み込み
3. Drive配布: `cc-publish-cx` コマンド（フォルダ名: `勤務表ショートカット_vX.Y.Z`）

## Related
- GAS本体: `~/Projects/bus-driver-work-status/` (src/00_main.gs のカスタムメニュー)
