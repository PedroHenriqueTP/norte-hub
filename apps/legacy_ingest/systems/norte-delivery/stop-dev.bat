@echo off
echo Stopping Delivery Platform...
taskkill /F /IM node.exe
taskkill /F /IM cmd.exe
echo.
echo All processes stopped. You can now use start-dev.bat again.
pause
