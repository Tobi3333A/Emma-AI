@echo off
title EmmaAI Sovereignty Node
cls

echo ========================================================
echo   EMMA AI: SOVEREIGNTY PROTOCOL
echo ========================================================
echo.

:: 1. Check for Node
echo [1/4] Checking System Requirements...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is missing. Download at: https://nodejs.org/
    pause
    exit /b
)

:: 2. Install Dependencies
echo [2/4] Validating Dependencies...
if not exist "node_modules\" (
    echo node_modules not found. Installing...
    call npm install
) else (
    echo node_modules detected.
)

:: 3. Check .env
echo [3/4] Checking Sovereignty Credentials...
if not exist ".env" (
    echo .env file missing. Creating template...
    echo VITE_SUPABASE_URL= > .env
    echo VITE_SUPABASE_PUBLISHABLE_KEY= >> .env
    echo VITE_OPENAI_API_KEY= >> .env
    echo ACTION REQUIRED: Please update the .env file with your project keys.
)

:: 4. Launch
echo [4/4] Launching Sovereignty Node...
echo --------------------------------------------------------
echo SUCCESS: EMMA AI SOVEREIGNTY NODE STARTED
echo LOCAL HUD: http://localhost:8080
echo --------------------------------------------------------
echo.

npm run dev