@echo off
setlocal

cd /d "%~dp0"

if not exist "package.json" (
  echo package.json was not found. Run this launcher from the project root.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo node_modules was not found.
  echo Run npm.cmd install first, then double-click this file again.
  pause
  exit /b 1
)

echo Starting Anti-UX Login Hell at http://localhost:5173/
start "Anti-UX Login Hell Dev Server" cmd /k "npm.cmd run dev -- --host 127.0.0.1 --port 5173"
timeout /t 3 /nobreak >nul
start "" "http://localhost:5173/"

echo Browser opened. Keep the dev server window open while using the app.
endlocal
exit /b 0
