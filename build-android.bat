@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    MYSTIC GARDEN - BUILD GOOGLE PLAY
echo ========================================
echo.

echo [1/7] Instalando dependencias...
call npm install
if errorlevel 1 goto error

echo [2/7] Compilando proyecto...
call npm run build
if errorlevel 1 goto error

echo [3/7] Añadiendo Android...
call npx cap add android
if errorlevel 1 (
    echo Android ya existe, continuando...
)

echo [4/7] Sincronizando...
call npx cap sync android
if errorlevel 1 goto error

echo [5/7] Copiando archivos de configuracion...
copy /Y "build-files\build.gradle" "android\app\build.gradle"
copy /Y "build-files\key.properties" "android\key.properties"

echo [6/7] Creando keystore...
echo.
echo ========================================
echo   RESPONDE A LAS PREGUNTAS:
echo   - Contraseña: mystic2025
echo   - Repite: mystic2025
echo   - Nombre: pulsa ENTER
echo   - Unidad: pulsa ENTER
echo   - Organizacion: pulsa ENTER
echo   - Ciudad: pulsa ENTER
echo   - Estado: pulsa ENTER
echo   - Pais: ES
echo   - Correcto: yes
echo   - Contraseña clave: pulsa ENTER
echo ========================================
echo.

cd android
keytool -genkey -v -keystore app\mystic-garden-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mysticgarden
if errorlevel 1 goto error

echo [7/7] Generando AAB...
call gradlew bundleRelease
if errorlevel 1 goto error

echo.
echo ========================================
echo   COMPLETADO!
echo.
echo   Tu archivo AAB esta en:
echo   android\app\build\outputs\bundle\release\app-release.aab
echo.
echo   Sube ese archivo a Google Play Console
echo ========================================
echo.
cd ..
pause
exit /b 0

:error
echo.
echo ========================================
echo   ERROR! Algo fallo.
echo   Revisa el mensaje de arriba.
echo ========================================
echo.
pause
exit /b 1
