; shift-shortcut.ahk — 勤務表ショートカット (Google Sheets)
; AutoHotkey v2 script
;
; Ctrl+キー で勤務表操作（Chrome上のみ）
;
; Ctrl+ESC = 選択範囲を交換（スワップ）
; Ctrl+F1  = 未充当に落とす
; Ctrl+F2  = 未充当エリア内を整理
; Ctrl+F3  = 確定フラグ

#Requires AutoHotkey v2.0
#SingleInstance Force

A_IconTip := "勤務表ショートカット"
TrayTip("勤務表ショートカット", "Ctrl+ESC/F1/F2/F3 が有効です", 1)

; ── Chrome上のみ有効 ──────────────────────────
#HotIf WinActive("ahk_exe chrome.exe")

^Escape:: Send "^!e"   ; スワップ
^F1:: Send "^!w"       ; 未充当に落とす
^F2:: Send "^!s"       ; 未充当エリア内を整理
^F3:: Send "^!q"       ; 確定フラグ

#HotIf
