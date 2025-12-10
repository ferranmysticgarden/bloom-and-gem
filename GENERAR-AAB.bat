@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    MYSTIC GARDEN - BUILD COMPLETO
echo    Version 3.0.7
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

REM IMPORTANTE: No crear keystore nuevo - usar el original existente
if exist "app\mystic-garden-key.jks" (
    echo ========================================
    echo    KEYSTORE ORIGINAL ENCONTRADO
    echo    Ruta: android\app\mystic-garden-key.jks
    echo ========================================
) else (
    echo ========================================
    echo    ERROR: KEYSTORE NO ENCONTRADO!
    echo    Debes tener el archivo original en:
    echo    android\app\mystic-garden-key.jks
    echo.
    echo    SHA1 original: 8A:3F:9E:B2:85:AC:01:4F:74:AA:7D:7A:76:B8:05:79:A7:0F:3A:C5
    echo ========================================
    pause
    exit /b 1
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