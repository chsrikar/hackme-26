@echo off
echo.
echo ========================================
echo   HackMe'26 Development Environment
echo ========================================
echo.

REM Start Backend (Django)
echo [1/3] Starting Backend API on port 4000...
start "HackMe26 Backend" cmd /k "cd /d %~dp0backend && venv\Scripts\activate && python manage.py runserver 4000"
timeout /t 2 /nobreak >nul

REM Start Main Website (React)
echo [2/3] Starting Main Website on port 5173...
start "HackMe26 Website" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 2 /nobreak >nul

REM Start Admin Panel (React)
echo [3/3] Starting Admin Panel on port 5174...
start "HackMe26 Admin" cmd /k "cd /d %~dp0admin && npm run dev"

echo.
echo ========================================
echo   All services are starting!
echo ========================================
echo.
echo Main Website:  http://localhost:5173
echo Admin Panel:   http://localhost:5174
echo Backend API:   http://localhost:4000/api/v1
echo.
echo Press any key to exit...
pause >nul
