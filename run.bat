@echo off
echo ==========================================
echo Starting HRMS Employee Management System...
echo ==========================================

echo Starting Spring Boot Backend...
start "HRMS Backend" cmd /c "cd ems-backend && mvnw.cmd spring-boot:run"

echo Waiting for backend to initialize (10 seconds)...
timeout /t 10 /nobreak

echo Opening Frontend in Browser...
start "" "%CD%\ems-frontend\index.html"

echo ==========================================
echo HRMS is now running!
echo Backend is running on http://localhost:8080
echo ==========================================
pause
