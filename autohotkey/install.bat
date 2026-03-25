@echo off
chcp 65001 >nul 2>&1
title 勤務表ショートカット セットアップ

echo ============================================
echo   勤務表ショートカット セットアップ
echo ============================================
echo.

:: ── 管理者権限チェック ──
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] 管理者権限が必要です。右クリック→「管理者として実行」してください。
    pause
    exit /b 1
)

:: ── AutoHotkey v2 インストール確認 ──
echo [STEP 1/2] AutoHotkey v2 確認...

set "AHK_EXE="
if exist "%ProgramFiles%\AutoHotkey\v2\AutoHotkey64.exe" (
    set "AHK_EXE=%ProgramFiles%\AutoHotkey\v2\AutoHotkey64.exe"
)
if exist "%ProgramFiles%\AutoHotkey\v2\AutoHotkey32.exe" (
    set "AHK_EXE=%ProgramFiles%\AutoHotkey\v2\AutoHotkey32.exe"
)

if defined AHK_EXE (
    echo   [OK] AutoHotkey v2 検出済み
) else (
    echo   [*] AutoHotkey v2 をインストールします...

    where winget >nul 2>&1
    if %errorLevel% equ 0 (
        echo   [*] winget でインストール中...
        winget install AutoHotkey.AutoHotkey --accept-package-agreements --accept-source-agreements -s winget
    ) else (
        echo   [*] インストーラをダウンロード中...
        powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://www.autohotkey.com/download/ahk-v2.exe' -OutFile '%TEMP%\ahk-v2-setup.exe' }"
        if not exist "%TEMP%\ahk-v2-setup.exe" (
            echo   [ERROR] ダウンロード失敗。手動: https://www.autohotkey.com/
            pause
            exit /b 1
        )
        echo   [*] サイレントインストール中...
        "%TEMP%\ahk-v2-setup.exe" /silent
        del "%TEMP%\ahk-v2-setup.exe" >nul 2>&1
    )

    if exist "%ProgramFiles%\AutoHotkey\v2\AutoHotkey64.exe" (
        set "AHK_EXE=%ProgramFiles%\AutoHotkey\v2\AutoHotkey64.exe"
    ) else if exist "%ProgramFiles%\AutoHotkey\v2\AutoHotkey32.exe" (
        set "AHK_EXE=%ProgramFiles%\AutoHotkey\v2\AutoHotkey32.exe"
    )

    if defined AHK_EXE (
        echo   [OK] インストール完了
    ) else (
        echo   [ERROR] インストール失敗。手動でインストールしてください。
        pause
        exit /b 1
    )
)

:: ── スクリプト配置 + スタートアップ登録 ──
echo.
echo [STEP 2/2] スクリプト配置...

set "DEST_DIR=%APPDATA%\ShiftShortcut"
set "DEST_AHK=%DEST_DIR%\shift-shortcut.ahk"

if not exist "%DEST_DIR%" mkdir "%DEST_DIR%"

set "SRC_AHK=%~dp0shift-shortcut.ahk"
if not exist "%SRC_AHK%" (
    echo   [ERROR] shift-shortcut.ahk が見つかりません
    pause
    exit /b 1
)

copy /Y "%SRC_AHK%" "%DEST_AHK%" >nul
echo   [OK] 配置: %DEST_AHK%

set "STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT=%STARTUP%\勤務表ショートカット.lnk"

powershell -Command "& { $ws = New-Object -ComObject WScript.Shell; $sc = $ws.CreateShortcut('%SHORTCUT%'); $sc.TargetPath = '%AHK_EXE%'; $sc.Arguments = '\"%DEST_AHK%\"'; $sc.WorkingDirectory = '%DEST_DIR%'; $sc.Description = '勤務表ショートカット'; $sc.Save() }"

echo   [OK] スタートアップ登録完了

start "" "%AHK_EXE%" "%DEST_AHK%"
echo   [OK] 起動完了

echo.
echo ============================================
echo   セットアップ完了！
echo.
echo   F8 で勤務表モード ON/OFF
echo   ON中: Ctrl+E=スワップ / Ctrl+W=未充当 / Ctrl+Q=確定
echo   トレイアイコン(H)で状態確認
echo ============================================
echo.
pause
