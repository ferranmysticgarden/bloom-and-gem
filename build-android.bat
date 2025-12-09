@echo off
echo ========================================
echo    MYSTIC GARDEN - BUILD PARA GOOGLE PLAY
echo ========================================
echo.

echo [1/6] Instalando dependencias...
call npm install

echo [2/6] Compilando proyecto...
call npm run build

echo [3/6] Añadiendo Android...
call npx cap add android

echo [4/6] Sincronizando...
call npx cap sync android

echo [5/6] Creando archivos de firma...

cd android

echo storePassword=mystic2025> key.properties
echo keyPassword=mystic2025>> key.properties
echo keyAlias=mysticgarden>> key.properties
echo storeFile=mystic-garden-key.jks>> key.properties

echo Creando keystore...
echo.
echo ========================================
echo   ATENCION: Responde a las preguntas
echo   Contraseña: mystic2025
echo   El resto pulsa ENTER
echo   Al final escribe: yes
echo ========================================
echo.

keytool -genkey -v -keystore app\mystic-garden-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mysticgarden

echo [6/6] Generando AAB...

echo def keystorePropertiesFile = rootProject.file("key.properties") > app\build.gradle
echo def keystoreProperties = new Properties() >> app\build.gradle
echo if (keystorePropertiesFile.exists()) { >> app\build.gradle
echo     keystoreProperties.load(new FileInputStream(keystorePropertiesFile)) >> app\build.gradle
echo } >> app\build.gradle
echo. >> app\build.gradle
echo apply plugin: 'com.android.application' >> app\build.gradle
echo. >> app\build.gradle
echo android { >> app\build.gradle
echo     namespace "com.mysticgarden.game" >> app\build.gradle
echo     compileSdk rootProject.ext.compileSdkVersion >> app\build.gradle
echo     defaultConfig { >> app\build.gradle
echo         applicationId "com.mysticgarden.game" >> app\build.gradle
echo         minSdkVersion rootProject.ext.minSdkVersion >> app\build.gradle
echo         targetSdkVersion rootProject.ext.targetSdkVersion >> app\build.gradle
echo         versionCode 2 >> app\build.gradle
echo         versionName "1.1.0" >> app\build.gradle
echo     } >> app\build.gradle
echo     signingConfigs { >> app\build.gradle
echo         release { >> app\build.gradle
echo             keyAlias keystoreProperties['keyAlias'] >> app\build.gradle
echo             keyPassword keystoreProperties['keyPassword'] >> app\build.gradle
echo             storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null >> app\build.gradle
echo             storePassword keystoreProperties['storePassword'] >> app\build.gradle
echo         } >> app\build.gradle
echo     } >> app\build.gradle
echo     buildTypes { >> app\build.gradle
echo         release { >> app\build.gradle
echo             minifyEnabled false >> app\build.gradle
echo             proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro' >> app\build.gradle
echo             signingConfig signingConfigs.release >> app\build.gradle
echo         } >> app\build.gradle
echo     } >> app\build.gradle
echo } >> app\build.gradle
echo. >> app\build.gradle
echo repositories { >> app\build.gradle
echo     flatDir { >> app\build.gradle
echo         dirs '../capacitor-cordova-android-plugins/src/main/libs', 'libs' >> app\build.gradle
echo     } >> app\build.gradle
echo } >> app\build.gradle
echo. >> app\build.gradle
echo dependencies { >> app\build.gradle
echo     implementation fileTree(include: ['*.jar'], dir: 'libs') >> app\build.gradle
echo     implementation "androidx.appcompat:appcompat:$androidxAppCompatVersion" >> app\build.gradle
echo     implementation "androidx.coordinatorlayout:coordinatorlayout:$androidxCoordinatorLayoutVersion" >> app\build.gradle
echo     implementation "androidx.core:core-splashscreen:$coreSplashScreenVersion" >> app\build.gradle
echo     implementation project(':capacitor-android') >> app\build.gradle
echo } >> app\build.gradle
echo. >> app\build.gradle
echo apply from: 'capacitor.build.gradle' >> app\build.gradle

call gradlew bundleRelease

echo.
echo ========================================
echo   ¡COMPLETADO!
echo   Tu archivo AAB esta en:
echo   android\app\build\outputs\bundle\release\app-release.aab
echo ========================================
echo.

cd ..
pause
