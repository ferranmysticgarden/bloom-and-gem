# 📋 MYSTIC GARDEN - INFORMACIÓN COMPLETA DEL PROYECTO

## 🎮 INFORMACIÓN DE LA APP
| Campo | Valor |
|-------|-------|
| Nombre | Mystic Garden |
| App ID | com.mysticgarden.game |
| Versión actual | 3.3.0 (versionCode 330) |
| Plataformas | Android, iOS, Web |

---

## 🔐 KEYSTORE (FIRMA ANDROID) - ⚠️ CRÍTICO ⚠️

| Campo | Valor |
|-------|-------|
| **Archivo Original** | C:\Users\PC\OneDrive\jks mystic\mysticgarden-release.jks |
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
keytool -list -v -keystore "C:\Users\PC\OneDrive\jks mystic\mysticgarden-release.jks" -storepass mystic2025 -alias mysticgarden
```

---

## 📁 UBICACIÓN DE ARCHIVOS CRÍTICOS

| Archivo | Ubicación | Descripción |
|---------|-----------|-------------|
| **Keystore original** | `C:\Users\PC\OneDrive\jks mystic\mysticgarden-release.jks` | NUNCA BORRAR NI REGENERAR |
| **Build Gradle** | `build-files/build.gradle` | Contiene versión y firma |
| **Key Properties** | `build-files/key.properties` | Contraseñas del keystore |
| **Capacitor Config** | `capacitor.config.ts` | Config de la app móvil |
| **Script AAB** | `GENERAR-AAB.bat` | Script para generar AAB |
| **Proyecto local** | `C:\Users\PC\bloom-and-gem` | Carpeta del proyecto |
| **AAB generado** | `android\app\build\outputs\bundle\release\` | Donde se genera el AAB |

---

## 🔧 CONTENIDO DE ARCHIVOS DE FIRMA

### build-files/key.properties:
```properties
storePassword=mystic2025
keyPassword=mystic2025
keyAlias=mysticgarden
storeFile=mysticgarden-release.jks
```

### build-files/build.gradle (versión actual):
```gradle
defaultConfig {
    applicationId "com.mysticgarden.game"
    versionCode 330
    versionName "3.3.0"
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

## 🚀 SCRIPT COMPLETO PARA GENERAR AAB

El script `GENERAR-AAB.bat` hace todo automáticamente:
1. Git stash y pull
2. npm install
3. npm run build
4. npx cap sync android
5. Copia keystore desde OneDrive
6. Copia build.gradle y key.properties
7. Verifica que el keystore existe
8. Ejecuta gradlew bundleRelease
9. Abre la carpeta del AAB

**Para ejecutar:** Doble clic en `GENERAR-AAB.bat`

---

## 📱 iOS (requiere Mac con Xcode)

### Pasos en Mac:
```bash
npm install
npm run build
npx cap add ios       # solo la primera vez
npx cap sync ios
npx cap open ios
```

### En Xcode (IMPORTANTE):
1. Selecciona el target "App"
2. **Signing & Capabilities:**
   - Team: tu Apple Developer Team
   - Bundle Identifier: com.mysticgarden.game
   - Signing Certificate: Distribution
3. **Build Settings:**
   - iOS Deployment Target: 13.0

### Para subir a App Store:
1. Product > Archive
2. Window > Organizer
3. Distribute App > App Store Connect
4. Upload

### Requisitos:
- Mac con macOS 12+ y Xcode 14+
- Apple Developer Account ($99/año)
- Certificado de distribución configurado
- App Store Connect: crear app con Bundle ID

### Solución Errores Comunes:
| Error | Solución |
|-------|----------|
| "No signing certificate" | Xcode > Preferences > Accounts > Manage Certificates |
| "Provisioning profile" | Automatic signing o crear en developer.apple.com |
| Build failed | Clean Build Folder (Cmd+Shift+K) |
| Code signing error | Verificar Team y Bundle ID en Signing & Capabilities |

---

## ⚠️ REGLAS CRÍTICAS - NUNCA OLVIDAR

1. **NUNCA** ejecutar `keytool -genkey` - destruye la firma original
2. **SIEMPRE** verificar SHA1 antes de subir AAB
3. **SIEMPRE** hacer backup del keystore original
4. El keystore con SHA1 `8A:3F:9E:B2:85:AC:01:4F:74:AA:7D:7A:76:B8:05:79:A7:0F:3A:C5` es el ÚNICO válido
5. El keystore está en OneDrive: `C:\Users\PC\OneDrive\jks mystic\mysticgarden-release.jks`

---

## 🚨 ERRORES COMETIDOS Y CÓMO EVITARLOS

### Error 1: Incluir `keytool -genkey` en el script
- **Problema:** Esto DESTRUYE la firma original y Google Play rechaza el AAB
- **Solución:** NUNCA incluir `keytool -genkey`. Solo verificar si existe.

### Error 2: No verificar el SHA1 antes de subir
- **Problema:** Google Play rechaza cualquier AAB que no tenga el SHA1 original
- **Solución:** SIEMPRE ejecutar `keytool -list` y verificar SHA1 antes de subir
- **SHA1 correcto:** `8A:3F:9E:B2:85:AC:01:4F:74:AA:7D:7A:76:B8:05:79:A7:0F:3A:C5`

### Error 3: Buscar keystore en ubicación incorrecta
- **Problema:** El keystore NO está en el proyecto, está en OneDrive
- **Solución:** El script copia desde `C:\Users\PC\OneDrive\jks mystic\mysticgarden-release.jks`

---

## 📝 PARA PRÓXIMAS VERSIONES

Para subir una nueva versión:
1. Editar `build-files/build.gradle`:
   - Incrementar `versionCode` (ej: 330 → 331)
   - Incrementar `versionName` (ej: "3.3.0" → "3.3.1")
2. Actualizar el header en `GENERAR-AAB.bat` con la nueva versión
3. Ejecutar `GENERAR-AAB.bat`
4. Subir el AAB a Google Play Console
