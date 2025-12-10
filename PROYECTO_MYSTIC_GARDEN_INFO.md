# 📋 MYSTIC GARDEN - INFORMACIÓN COMPLETA DEL PROYECTO

## 🎮 INFORMACIÓN DE LA APP
| Campo | Valor |
|-------|-------|
| Nombre | Mystic Garden |
| App ID | com.mysticgarden.game |
| Versión actual | 3.1.1 (versionCode 311) |
| Plataformas | Android, iOS, Web |

---

## 🔐 KEYSTORE (FIRMA ANDROID) - ⚠️ CRÍTICO ⚠️

| Campo | Valor |
|-------|-------|
| **Archivo** | android/app/mystic-garden-key.jks |
| **Alias** | mysticgarden |
| **Store Password** | mystic2025 |
| **Key Password** | mystic2025 |
| **Organización** | Evoluxe, Madrid, ES |
| **SHA1 ORIGINAL (Google Play)** | `8A:3F:9E:B2:85:AC:01:4F:74:AA:7D:7A:76:B8:05:79:A7:0F:3A:C5` |

### ⚠️ REGLAS DEL KEYSTORE:
- **NUNCA** crear un keystore nuevo con `keytool -genkey`
- **NUNCA** regenerar el keystore - es IRREEMPLAZABLE
- **SIEMPRE** verificar SHA1 antes de subir a Google Play
- Si el SHA1 no coincide, el AAB será RECHAZADO por Google Play

### Comando para verificar SHA1:
```cmd
keytool -list -v -keystore android\app\mystic-garden-key.jks -storepass mystic2025 -alias mysticgarden
```

### Comando para buscar keystores en PC:
```cmd
cd C:\
dir /s /b *.jks 2>nul
```

---

## 📁 UBICACIÓN DE ARCHIVOS CRÍTICOS

| Archivo | Ubicación | Descripción |
|---------|-----------|-------------|
| **Keystore original** | `android/app/mystic-garden-key.jks` | NUNCA BORRAR NI REGENERAR |
| **Build Gradle** | `build-files/build.gradle` | Contiene versión y firma |
| **Key Properties** | `build-files/key.properties` | Contraseñas del keystore |
| **Capacitor Config** | `capacitor.config.ts` | Config de la app móvil |
| **Script AAB** | `GENERAR-AAB.bat` | Script para generar AAB |
| **Proyecto local** | `C:\Users\PC\bloom-and-gem` | Carpeta del proyecto |
| **AAB generado** | `android/app/build/outputs/bundle/release/` | Donde se genera el AAB |

---

## 🔧 CONTENIDO DE ARCHIVOS DE FIRMA

### build-files/key.properties:
```properties
storePassword=mystic2025
keyPassword=mystic2025
keyAlias=mysticgarden
storeFile=mystic-garden-key.jks
```

### build-files/build.gradle (sección importante):
```gradle
defaultConfig {
    applicationId "com.mysticgarden.game"
    versionCode 310
    versionName "3.1.0"
}

signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
        storePassword keystoreProperties['storePassword']
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
    }
}
```

---

## 🌐 URLs
| Servicio | URL |
|----------|-----|
| Preview Lovable | https://3c83a2f7-47cb-4ba3-90ff-4fe57d4d7b89.lovableproject.com |
| Supabase | https://rmcktxzxalcwjktvszmw.supabase.co |
| GitHub | https://github.com/ferranmysticgarden/bloom-and-gem |

---

## 🗄️ BASE DE DATOS (Lovable Cloud)
**Proyecto ID:** rmcktxzxalcwjktvszmw

**Tabla: game_progress**
- lives, gems, leaves, current_level, unlocked_levels
- hammers, bombs, shuffles, rainbows
- last_life_refill, unlimited_lives_until
- RLS habilitado (solo el usuario ve/edita su progreso)

---

## 🔑 SECRETS CONFIGURADOS (Lovable Cloud)
- SUPABASE_URL
- SUPABASE_PUBLISHABLE_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_DB_URL

---

## 🔑 GOOGLE OAUTH
| Campo | Valor |
|-------|-------|
| ID Cliente | 724965946641-h7go2nrhtgcvvglv516ptvm09ddrdvfo.apps.googleusercontent.com |
| Secreto | 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 |

---

## 🚀 COMANDO COMPLETO PARA GENERAR AAB

```cmd
cd C:\Users\PC\bloom-and-gem
git stash
git pull
npm install
npm run build
npx cap sync android
copy /Y "build-files\build.gradle" "android\app\build.gradle"
copy /Y "build-files\key.properties" "android\key.properties"
cd android

REM Verificar keystore original - NO crear nuevo
if exist "app\mystic-garden-key.jks" (
    echo ========================================
    echo    KEYSTORE ORIGINAL ENCONTRADO - OK
    echo    SHA1: 8A:3F:9E:B2:85:AC:01:4F:74:AA:7D:7A:76:B8:05:79:A7:0F:3A:C5
    echo ========================================
) else (
    echo ========================================
    echo    ERROR: KEYSTORE ORIGINAL NO ENCONTRADO
    echo    Debe estar en: android\app\mystic-garden-key.jks
    echo    SHA1: 8A:3F:9E:B2:85:AC:01:4F:74:AA:7D:7A:76:B8:05:79:A7:0F:3A:C5
    echo ========================================
    pause
    exit /b 1
)

gradlew.bat bundleRelease
explorer app\build\outputs\bundle\release
cd ..

REM === iOS (en Mac con Xcode) ===
REM npx cap sync ios
REM npx cap open ios
```

---

## 📱 iOS (requiere Mac con Xcode)
```cmd
npx cap sync ios
npx cap open ios
```

---

## ⚠️ REGLAS CRÍTICAS - NUNCA OLVIDAR

1. **NUNCA** ejecutar `keytool -genkey` - destruye la firma original
2. **SIEMPRE** verificar SHA1 antes de subir AAB
3. **SIEMPRE** hacer backup del keystore original
4. El keystore con SHA1 `8A:3F:9E:B2:85:AC:01:4F:74:AA:7D:7A:76:B8:05:79:A7:0F:3A:C5` es el ÚNICO válido
5. **SIEMPRE** copiar build.gradle y key.properties desde build-files/ antes de compilar

---

## 🚨 ERRORES COMETIDOS Y CÓMO EVITARLOS

### Error 1: Incluir `keytool -genkey` en el script
- **Qué pasó:** Se incluyó un comando para crear un keystore nuevo si no existía
- **Problema:** Esto DESTRUYE la firma original y Google Play rechaza el AAB
- **Solución:** NUNCA incluir `keytool -genkey` en ningún script. Solo verificar si existe.
- **Cómo evitarlo:** El script debe PARAR si no encuentra el keystore, NO crear uno nuevo

### Error 2: No verificar el SHA1 antes de subir
- **Qué pasó:** Se subió un AAB firmado con un keystore diferente
- **Problema:** Google Play rechaza cualquier AAB que no tenga el SHA1 original
- **Solución:** SIEMPRE ejecutar `keytool -list` y verificar SHA1 antes de subir
- **SHA1 correcto:** `8A:3F:9E:B2:85:AC:01:4F:74:AA:7D:7A:76:B8:05:79:A7:0F:3A:C5`

### Error 3: Olvidar copiar los archivos de build-files/
- **Qué pasó:** Se compiló sin copiar build.gradle y key.properties actualizados
- **Problema:** Se usó versión incorrecta o configuración de firma incorrecta
- **Solución:** SIEMPRE ejecutar los comandos `copy /Y` antes de `gradlew.bat bundleRelease`

### Error 4: Dar bloques de comandos incompletos
- **Qué pasó:** Se pasó un bloque sin la verificación del keystore
- **Problema:** El usuario puede ejecutar sin darse cuenta de que falta el keystore
- **Solución:** SIEMPRE dar el bloque COMPLETO con verificación del keystore

---

## 📝 NOTAS PARA EL FUTURO

- La versión actual es **3.1.0 (versionCode 310)**
- Para la próxima versión: incrementar versionCode y versionName en `build-files/build.gradle`
- El keystore NUNCA debe regenerarse - si se pierde, hay que buscar backup o contactar Google
- Los archivos de firma están en `build-files/` y deben copiarse antes de compilar
