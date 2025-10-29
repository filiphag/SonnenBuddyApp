@echo off
setlocal

:: === CONFIGURABLE ===
set JAVA_HOME=C:\Users\Filip\AppData\Local\Programs\Eclipse Adoptium\jdk-17.0.15.6-hotspot
set KEYSTORE_PATH=C:\Users\Filip\Proj\SonnenBuddyApp\keystore\android-release-key.jks
set KEY_ALIAS=android-key-alias
set KEYSTORE_PASSWORD=**************
set KEY_PASSWORD=**************

:: === ENVIRONMENT SETUP ===
echo [INFO] Using Java from: %JAVA_HOME%
set PATH=%JAVA_HOME%\bin;%PATH%

:: === STEP 1: Build Ionic App ===
echo [INFO] Running Ionic production build...
call npx ionic build --prod || goto :error

:: === STEP 2: Sync to Capacitor Android Project ===
echo [INFO] Syncing Capacitor...
call npx cap sync android || goto :error

:: === STEP 3: Build Signed AAB with Gradle ===
echo [INFO] Building signed AAB...
cd android
call gradlew bundleRelease ^
  -Pandroid.injected.signing.store.file=%KEYSTORE_PATH% ^
  -Pandroid.injected.signing.store.password=%KEYSTORE_PASSWORD% ^
  -Pandroid.injected.signing.key.alias=%KEY_ALIAS% ^
  -Pandroid.injected.signing.key.password=%KEY_PASSWORD% || goto :error

:: === STEP 4: Build Signed APK ===
echo [INFO] Building signed APK...
call gradlew assembleRelease ^
  -Pandroid.injected.signing.store.file=%KEYSTORE_PATH% ^
  -Pandroid.injected.signing.store.password=%KEYSTORE_PASSWORD% ^
  -Pandroid.injected.signing.key.alias=%KEY_ALIAS% ^
  -Pandroid.injected.signing.key.password=%KEY_PASSWORD% || goto :error

:: === DONE ===
echo.
echo "[SUCCESS] Builds completed successfully!"
echo "[AAB] -> android\app\build\outputs\bundle\release\app-release.aab"
echo "[APK] -> android\app\build\outputs\apk\release\app-release.apk"
echo.
goto :eof

:error
echo [ERROR] Build failed.
exit /b 1
