@echo off
echo ========================================================
echo HR Nexus - Full Stack Application Builder
echo ========================================================

echo [1/3] Copying Frontend files to Backend static folder...
mkdir "ems-backend\src\main\resources\static" 2>nul
xcopy /s /e /y /q "ems-frontend\*" "ems-backend\src\main\resources\static\"

echo [2/3] Building Spring Boot Application (Maven Package)...
cd ems-backend
call mvnw.cmd clean package -DskipTests
cd ..

echo.
echo [3/3] Build Complete!
echo ========================================================
echo The deployable JAR file is located at:
echo ems-backend\target\ems-0.0.1-SNAPSHOT.jar
echo.
echo You can run it using:
echo java -jar ems-backend\target\ems-0.0.1-SNAPSHOT.jar
echo.
echo NOTE: Since the frontend is bundled, you can access the app at:
echo http://localhost:8080/index.html
echo ========================================================
pause
