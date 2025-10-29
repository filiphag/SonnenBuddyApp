@echo off
setlocal

:: === CONFIGURABLE ===
set JAVA_HOME=C:\Users\Filip\AppData\Local\Programs\Eclipse Adoptium\jdk-17.0.15.6-hotspot
REM set KEYSTORE_PATH=keystore/android-release-key.jks
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

:: === STEP 3: Build Signed APK with Gradle ===
echo [INFO] Building signed APK...
cd android
call gradlew assembleRelease ^
  -Pandroid.injected.signing.store.file=%KEYSTORE_PATH% ^
  -Pandroid.injected.signing.store.password=%KEYSTORE_PASSWORD% ^
  -Pandroid.injected.signing.key.alias=%KEY_ALIAS% ^
  -Pandroid.injected.signing.key.password=%KEY_PASSWORD% || goto :error

:: === DONE ===
echo [SUCCESS] Release APK is located at:
echo android\app\build\outputs\apk\release\app-release.apk
goto :eof

:error
echo [ERROR] Build failed.
exit /b 1
