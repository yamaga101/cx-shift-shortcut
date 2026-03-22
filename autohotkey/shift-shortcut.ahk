; shift-shortcut.ahk — 勤務表ショートカット (Google Sheets)
; AutoHotkey v2 script
;
; F6 で勤務表モード ON/OFF トグル (Chrome 上のみ)
; モードON: Ctrl+E/W/Q → Ctrl+Alt+E/W/Q に変換
; モードOFF: 通常の Chrome 動作
;
; インストール: https://www.autohotkey.com/
; 使い方: このファイルをダブルクリックで起動
;         スタートアップに入れれば自動起動

#Requires AutoHotkey v2.0
#SingleInstance Force

shiftPlannerMode := false

; ── トレイアイコン設定 ────────────────────────────
A_IconTip := "勤務表ショートカット (OFF)"

UpdateTray() {
    global shiftPlannerMode
    if shiftPlannerMode {
        A_IconTip := "勤務表ショートカット (ON)"
        TrayTip("勤務表モード ON", "Ctrl+E/W/Q が有効です`nF6 で解除", 1)
    } else {
        A_IconTip := "勤務表ショートカット (OFF)"
        TrayTip("勤務表モード OFF", "通常のショートカットに戻りました", 1)
    }
}

; ── F6 トグル (Chrome 上のみ) ─────────────────────
#HotIf WinActive("ahk_exe chrome.exe")

F6:: {
    global shiftPlannerMode
    shiftPlannerMode := !shiftPlannerMode
    UpdateTray()
}

#HotIf WinActive("ahk_exe chrome.exe") && shiftPlannerMode

; Ctrl+E → Ctrl+Alt+E (スワップ)
^e:: {
    Send "^!e"
}

; Ctrl+W → Ctrl+Alt+W (未充当に落とす — タブ閉じ無効化)
^w:: {
    Send "^!w"
}

; Ctrl+Q → Ctrl+Alt+Q (確定マーク — Chrome終了無効化)
^q:: {
    Send "^!q"
}

#HotIf
