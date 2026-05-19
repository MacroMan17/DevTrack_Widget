@echo off
echo Building DevTrack Widget...
echo.
cd /d "%~dp0"
call npm run build
call npx electron-builder --win --dir
echo.
echo Build complete! App is in dist\win-unpacked\
pause
