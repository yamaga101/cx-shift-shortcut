@echo off
chcp 65001 >nul 2>&1
title 勤務表ショートカット セットアップ

echo ============================================
echo   勤務表ショートカット セットアップ
echo   ※ 管理者権限は不要です
echo ============================================
echo.

set "DEST_DIR=%APPDATA%\ShiftShortcut"
set "AHK_DIR=%DEST_DIR%\AutoHotkey"
set "DEST_AHK=%DEST_DIR%\shift-shortcut.ahk"

if not exist "%DEST_DIR%" mkdir "%DEST_DIR%"

:: ── STEP 1: AutoHotkey v2 ポータブル版 ──
echo [STEP 1/3] AutoHotkey v2 確認...

set "AHK_EXE=%AHK_DIR%\v2\AutoHotkey64.exe"
if exist "%AHK_EXE%" (
    echo   [OK] 検出済み
    goto :step2
)

set "AHK_EXE=%AHK_DIR%\v2\AutoHotkey32.exe"
if exist "%AHK_EXE%" (
    echo   [OK] 検出済み
    goto :step2
)

:: システムにインストール済みならそれを使う
if exist "%ProgramFiles%\AutoHotkey\v2\AutoHotkey64.exe" (
    set "AHK_EXE=%ProgramFiles%\AutoHotkey\v2\AutoHotkey64.exe"
    echo   [OK] システムインストール版を検出
    goto :step2
)
if exist "%ProgramFiles%\AutoHotkey\v2\AutoHotkey32.exe" (
    set "AHK_EXE=%ProgramFiles%\AutoHotkey\v2\AutoHotkey32.exe"
    echo   [OK] システムインストール版を検出
    goto :step2
)

echo   [*] ポータブル版をダウンロード中...
set "AHK_ZIP=%TEMP%\ahk-v2.zip"
powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://www.autohotkey.com/download/ahk-v2.zip' -OutFile '%AHK_ZIP%' }"

if not exist "%AHK_ZIP%" (
    echo   [ERROR] ダウンロード失敗。
    echo   手動で https://www.autohotkey.com/download/ahk-v2.zip をダウンロードし
    echo   %AHK_DIR% に展開してください。
    pause
    exit /b 1
)

echo   [*] 展開中...
if not exist "%AHK_DIR%" mkdir "%AHK_DIR%"
powershell -Command "Expand-Archive -Path '%AHK_ZIP%' -DestinationPath '%AHK_DIR%' -Force"
del "%AHK_ZIP%" >nul 2>&1

set "AHK_EXE=%AHK_DIR%\v2\AutoHotkey64.exe"
if not exist "%AHK_EXE%" set "AHK_EXE=%AHK_DIR%\v2\AutoHotkey32.exe"
if not exist "%AHK_EXE%" (
    :: v2直下にある場合（zip構成による）
    set "AHK_EXE=%AHK_DIR%\AutoHotkey64.exe"
    if not exist "%AHK_EXE%" set "AHK_EXE=%AHK_DIR%\AutoHotkey32.exe"
)

if not exist "%AHK_EXE%" (
    echo   [ERROR] AutoHotkey の展開に失敗しました。
    pause
    exit /b 1
)

echo   [OK] ポータブル版を配置しました

:step2
:: ── STEP 2: AHK スクリプト生成 ──
echo [STEP 2/3] スクリプト配置...

powershell -Command "[IO.File]::WriteAllBytes('%DEST_AHK%', [Convert]::FromBase64String('OyBzaGlmdC1zaG9ydGN1dC5haGsg4oCUIOWLpOWLmeihqOOCt+ODp+ODvOODiOOCq+ODg+ODiCAoR29vZ2xlIFNoZWV0cykKOyBBdXRvSG90a2V5IHYyIHNjcmlwdAo7CjsgQ3RybCvjgq3jg7wg44Gn5Yuk5YuZ6KGo5pON5L2c77yIQ2hyb21l5LiK44Gu44G/77yJCjsKOyBDdHJsK0VTQyA9IOmBuOaKnuevhOWbsuOCkuS6pOaPm++8iOOCueODr+ODg+ODl++8iQo7IEN0cmwrRjEgID0g5pyq5YWF5b2T44Gr6JC944Go44GZCjsgQ3RybCtGMiAgPSDmnKrlhYXlvZPjgqjjg6rjgqLlhoXjgpLmlbTnkIYKOyBDdHJsK0YzICA9IOeiuuWumuODleODqeOCsAoKI1JlcXVpcmVzIEF1dG9Ib3RrZXkgdjIuMAojU2luZ2xlSW5zdGFuY2UgRm9yY2UKCkFfSWNvblRpcCA6PSAi5Yuk5YuZ6KGo44K344On44O844OI44Kr44OD44OIIgpUcmF5VGlwKCLli6Tli5nooajjgrfjg6fjg7zjg4jjgqvjg4Pjg4giLCAiQ3RybCtFU0MvRjEvRjIvRjMg44GM5pyJ5Yq544Gn44GZIiwgMSkKCjsg4pSA4pSAIENocm9tZeS4iuOBruOBv+acieWKuSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKI0hvdElmIFdpbkFjdGl2ZSgiYWhrX2V4ZSBjaHJvbWUuZXhlIikKCl5Fc2NhcGU6OiBTZW5kICJeIWUiICAgOyDjgrnjg6/jg4Pjg5cKXkYxOjogU2VuZCAiXiF3IiAgICAgICA7IOacquWFheW9k+OBq+iQveOBqOOBmQpeRjI6OiBTZW5kICJeIXMiICAgICAgIDsg5pyq5YWF5b2T44Ko44Oq44Ki5YaF44KS5pW055CGCl5GMzo6IFNlbmQgIl4hcSIgICAgICAgOyDnorrlrprjg5Xjg6njgrAKCiNIb3RJZgo='))"

if not exist "%DEST_AHK%" (
    echo   [ERROR] スクリプト生成に失敗しました
    pause
    exit /b 1
)

echo   [OK] 配置: %DEST_AHK%

:: ── STEP 3: スタートアップ登録 ──
echo [STEP 3/3] スタートアップ登録...

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
echo   Ctrl+ESC = スワップ
echo   Ctrl+F1  = 未充当に落とす
echo   Ctrl+F2  = 未充当エリア内を整理
echo   Ctrl+F3  = 確定フラグ
echo ============================================
echo.
pause
