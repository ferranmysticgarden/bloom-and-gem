# 📋 MYSTIC GARDEN - INFORMACIÓN COMPLETA DEL PROYECTO

## 🎮 INFORMACIÓN DE LA APP
| Campo | Valor |
|-------|-------|
| Nombre | Mystic Garden |
| App ID | com.mysticgarden.game |
| Versión actual | 3.0.7 (versionCode 307) |
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

### ⚠️ IMPORTANTE:
- **NUNCA** crear un keystore nuevo con `keytool -genkey`
- **SIEMPRE** verificar SHA1 antes de subir a Google Play
- El keystore original es **IRREEMPLAZABLE**

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

## 🌐 URLs
| Servicio | URL |
|----------|-----|
| Preview Lovable | https://3c83a2f7-47cb-4ba3-90ff-4fe57d4d7b89.lovableproject.com |
| Supabase | https://rmcktxzxalcwjktvszmw.supabase.co |
| GitHub | https://github.com/ferranmysticgarden/bloom-and-gem |

---

## 🗄️ BASE DE DATOS (Supabase/Lovable Cloud)
**Proyecto ID:** rmcktxzxalcwjktvszmw

**Tabla: game_progress**
- lives, gems, leaves, current_level, unlocked_levels
- hammers, bombs, shuffles, rainbows
- last_life_refill, unlimited_lives_until
- RLS habilitado (solo el usuario ve/edita su progreso)

---

## 📁 ARCHIVOS IMPORTANTES
| Archivo | Ubicación |
|---------|-----------|
| Build Gradle | build-files/build.gradle |
| Key Properties | build-files/key.properties |
| Capacitor Config | capacitor.config.ts |
| Script AAB | GENERAR-AAB.bat |
| Proyecto local | C:\Users\PC\bloom-and-gem |
| AAB generado | android/app/build/outputs/bundle/release/ |

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

## 🚀 COMANDOS PARA GENERAR AAB

### Comando rápido (si ya tienes dependencias):
```cmd
cd C:\Users\PC\bloom-and-gem
git pull
copy /Y "build-files\build.gradle" "android\app\build.gradle"
copy /Y "build-files\key.properties" "android\key.properties"
cd android
gradlew.bat bundleRelease
explorer app\build\outputs\bundle\release
```

### Comando completo (con npm):
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
gradlew.bat bundleRelease
explorer app\build\outputs\bundle\release
```

---

## 📱 iOS (requiere Mac con Xcode)
```cmd
npx cap sync ios
npx cap open ios
```

---

## ⚠️ REGLAS CRÍTICAS

1. **NUNCA** ejecutar `keytool -genkey` - destruye la firma original
2. **SIEMPRE** verificar SHA1 antes de subir AAB
3. **SIEMPRE** hacer backup del keystore original
4. El keystore con SHA1 `8A:3F:9E:B2:85:AC:01:4F:74:AA:7D:7A:76:B8:05:79:A7:0F:3A:C5` es el ÚNICO válido
