@echo off
echo Checking for Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed!
    echo Opening Python download page...
    start https://www.python.org/downloads/
    echo.
    echo Please install Python and check "Add Python to PATH"
    echo Then run this file again.
    pause
    exit /b
)

echo Starting server...
cd /d "%~dp0"
start http://localhost:8000
python -m http.server 8000