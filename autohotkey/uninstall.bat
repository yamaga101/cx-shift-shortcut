@echo off
chcp 65001 >nul 2>&1
title 勤務表ショートカット アンインストール

echo ============================================
echo   勤務表ショートカット アンインストール
echo ============================================
echo.

:: ── 実行中のスクリプトを停止 ──
taskkill /f /im AutoHotkey64.exe >nul 2>&1
taskkill /f /im AutoHotkey32.exe >nul 2>&1
echo [OK] AutoHotkey プロセス停止

:: ── スタートアップから削除 ──
set "SHORTCUT=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\勤務表ショートカット.lnk"
if exist "%SHORTCUT%" (
    del "%SHORTCUT%"
    echo [OK] スタートアップ登録解除
)

:: ── スクリプト削除 ──
set "DEST_DIR=%APPDATA%\ShiftShortcut"
if exist "%DEST_DIR%" (
    rmdir /s /q "%DEST_DIR%"
    echo [OK] スクリプト削除: %DEST_DIR%
)

echo.
echo [OK] アンインストール完了
echo     ※ AutoHotkey本体は残っています（他で使う場合のため）
echo.
pause
