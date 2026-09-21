@echo off
setlocal enabledelayedexpansion
title DDCET Practice Quiz - Launcher
cd /d "%~dp0"

echo ================================================================
echo                 DDCET PRACTICE QUIZ PORTAL
echo ================================================================
echo.
echo [1/3] Checking environment and dependencies...
if not exist "node_modules" (
    echo [INFO] Installing required npm packages...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed. Please check your Node environment.
        pause
        exit /b 1
    )
)
echo [SUCCESS] Dependencies verified.

echo.
echo [2/3] Checking production build...
if not exist "dist" (
    echo [INFO] Building production bundle...
    call npm run build
)

echo.
echo [3/3] Starting DDCET Practice Quiz Dev Server...
echo.
echo Access URL: http://localhost:5173
echo Press Ctrl+C to stop the server.
echo ================================================================
echo.

:: Open browser automatically
start "" http://localhost:5173

:: Launch Vite dev server
call npm run dev -- --host

endlocal
