@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    MYSTIC GARDEN - BUILD COMPLETO
echo    Version 3.0.6
echo ========================================
echo.

cd /d C:\Users\PC\bloom-and-gem

echo [1/6] Git stash y pull...
git stash
git pull

echo [2/6] Instalando dependencias...
call npm install

echo [3/6] Build...
call npm run build

echo [4/6] Sync Android...
call npx cap sync android

echo [5/6] Copiando configuracion Android...
copy /Y "build-files\build.gradle" "android\app\build.gradle"
copy /Y "build-files\key.properties" "android\key.properties"

cd android

REM Solo crear keystore si NO existe (para mantener la firma original)
if not exist "app\mystic-garden-key.jks" (
    echo Creando keystore nuevo...
    keytool -genkey -v -keystore app\mystic-garden-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mysticgarden -storepass mystic2025 -keypass mystic2025 -dname "CN=Mystic Garden, OU=Games, O=Evoluxe, L=Madrid, ST=Madrid, C=ES"
) else (
    echo Keystore existente encontrado - usando el original
)

echo [6/6] Generando AAB firmado...
call gradlew.bat bundleRelease

echo.
echo ========================================
echo    ANDROID COMPLETADO!
echo ========================================
echo.
echo AAB generado en:
echo android\app\build\outputs\bundle\release\
echo.
explorer app\build\outputs\bundle\release

cd ..

echo.
echo ========================================
echo    PARA iOS (ejecutar en Mac):
echo    npx cap sync ios
echo    npx cap open ios
echo ========================================
pause