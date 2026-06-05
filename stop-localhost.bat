@echo off
setlocal

cd /d "%~dp0"

set "FOUND="

for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":5173 .*LISTENING"') do (
  set "FOUND=1"
  echo Stopping Anti-UX Login Hell dev server on port 5173, PID %%P...
  taskkill /PID %%P /T /F >nul 2>nul
  if errorlevel 1 (
    echo Could not stop PID %%P. It may already be closed or require permission.
  ) else (
    echo Stopped PID %%P.
  )
)

if not defined FOUND (
  echo No dev server is listening on port 5173.
)

pause
endlocal
exit /b 0
