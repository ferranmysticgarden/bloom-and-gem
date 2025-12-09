@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    GENERANDO AAB FIRMADO
echo ========================================
echo.

cd /d C:\Users\PC\bloom-and-gem

echo [1/6] Git pull...
git pull

echo [2/6] Build...
call npm run build

echo [3/6] Sync Android...
call npx cap sync android

echo [4/6] Copiando configuracion...
copy /Y "build-files\build.gradle" "android\app\build.gradle"
copy /Y "build-files\key.properties" "android\key.properties"

echo [5/6] Creando keystore...
cd android
if exist "app\mystic-garden-key.jks" del "app\mystic-garden-key.jks"
keytool -genkey -v -keystore app\mystic-garden-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mysticgarden -storepass mystic2025 -keypass mystic2025 -dname "CN=Mystic Garden, OU=Games, O=Evoluxe, L=Madrid, ST=Madrid, C=ES"

echo [6/6] Generando AAB firmado...
call gradlew bundleRelease

echo.
echo ========================================
echo    COMPLETADO!
echo ========================================
echo.
echo Tu AAB esta en:
explorer app\build\outputs\bundle\release
pause
