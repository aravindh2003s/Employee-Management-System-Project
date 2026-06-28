@echo off
title HR Nexus Frontend Server
echo ===================================================
echo       Starting HR Nexus Frontend Server
echo ===================================================

cd ems-frontend

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo [INFO] Python detected. Starting local server on port 8080...
    echo [INFO] Opening browser to http://localhost:8080/index.html
    
    :: Wait 1 second before opening browser so server has time to start
    start "" "http://localhost:8080/index.html"
    python -m http.server 8080
    exit /b
)

:: Fallback if Python is not installed - check for NPX (Node)
call npx --version >nul 2>&1
if %errorlevel% == 0 (
    echo [INFO] Node.js/npx detected. Starting local server on port 8080...
    start "" "http://localhost:8080/index.html"
    call npx http-server -p 8080
    exit /b
)

:: Ultimate fallback: Just open the file directly in the browser
echo [WARNING] Neither Python nor Node.js found to run a local server.
echo [INFO] Opening the file directly in your default browser instead...
start index.html
