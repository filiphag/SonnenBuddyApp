@echo off
REM Set JDK 17 path
set "JAVA_HOME=C:\Users\Filip\AppData\Local\Programs\Eclipse Adoptium\jdk-17.0.15.6-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Using Java from: %JAVA_HOME%
java -version

REM Clean and build
cd android
if exist gradlew (
    echo gradlew clean
    call gradlew clean
) else (
    echo gradlew not found – run "ionic cap sync android" first
    pause
    exit /b 1
)
cd ..

REM Use local or global ionic
REM npx cap clean
REM npx cap sync android
npx ionic cap build android

REM Back to android folder and assemble debug APK
REM cd android
REM echo Building debug APK...
REM call gradlew assembleDebug
REM cd ..
REM echo APK should now be in: android\app\build\outputs\apk\debug\

pause
