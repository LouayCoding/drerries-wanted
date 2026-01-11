@echo off
echo Installing dependencies...
cd /d "%~dp0"
call npm install
echo.
echo Installation complete!
echo.
echo To start the development server, run: npm run dev
pause
