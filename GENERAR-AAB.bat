@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    GENERANDO AAB FIRMADO
echo ========================================
echo.

cd /d C:\Users\PC\bloom-and-gem

echo [1/5] Git pull...
git pull

echo [2/5] Build...
call npm run build

echo [3/5] Sync Android...
call npx cap sync android

echo [4/5] Copiando configuracion...
copy /Y "build-files\build.gradle" "android\app\build.gradle"
copy /Y "build-files\key.properties" "android\key.properties"

cd android

REM IMPORTANTE: NO generar nuevo keystore - usar el original
if exist "app\mysticgarden-release.jks" (
    echo.
    echo [OK] Keystore encontrado - usando el existente
    echo.
) else (
    echo.
    echo ========================================
    echo   ERROR: KEYSTORE NO ENCONTRADO!
    echo.
    echo   Copia tu keystore original a:
    echo   android\app\mysticgarden-release.jks
    echo.
    echo   SIN el keystore original NO puedes
    echo   actualizar la app en Google Play.
    echo ========================================
    echo.
    pause
    exit /b 1
)

echo [5/5] Generando AAB firmado...
call gradlew bundleRelease

echo.
echo ========================================
echo    COMPLETADO!
echo ========================================
echo.
echo Tu AAB esta en:
explorer app\build\outputs\bundle\release
pause
