@echo off
setlocal enabledelayedexpansion

echo ====================================================
echo             STREAMHOME AUTOMATED SETUP WIZARD
echo ====================================================
echo.

:: 1. Create local bin directory
if not exist "bin" mkdir bin

:: 2. Check and Install Python
python --version >nul 2>&1
if "%errorlevel%"=="0" goto :python_installed

echo Python is not installed. Installing Python 3.11...
echo Downloading installer...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.8/python-3.11.8-amd64.exe' -OutFile 'python_installer.exe'"
echo Installing Python silently...
start /wait python_installer.exe /quiet InstallAllUsers=1 PrependPath=1
del python_installer.exe
echo Python installation finished.
set "PATH=C:\Program Files\Python311\;C:\Program Files\Python311\Scripts\;%PATH%"

:python_installed
echo Python is ready.

:: 3. Check and Install Node.js
node --version >nul 2>&1
if "%errorlevel%"=="0" goto :node_installed

echo Node.js is not installed. Installing Node.js 20...
echo Downloading installer...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi' -OutFile 'node_installer.msi'"
echo Installing Node.js silently...
start /wait msiexec /i node_installer.msi /qn /norestart
del node_installer.msi
echo Node.js installation finished.
set "PATH=C:\Program Files\nodejs\;%PATH%"

:node_installed
echo Node.js is ready.

:: 4. Check and Install FFmpeg
ffmpeg -version >nul 2>&1
if "%errorlevel%"=="0" goto :ffmpeg_ready

if exist "C:\ffmpeg\bin\ffmpeg.exe" (
    echo Found FFmpeg at C:\ffmpeg\bin. Copying to bin directory...
    copy /y "C:\ffmpeg\bin\ffmpeg.exe" bin\ >nul
    copy /y "C:\ffmpeg\bin\ffprobe.exe" bin\ >nul 2>&1
    goto :ffmpeg_ready
)
if exist "C:\ffmpeg\ffmpeg.exe" (
    echo Found FFmpeg at C:\ffmpeg. Copying to bin directory...
    copy /y "C:\ffmpeg\ffmpeg.exe" bin\ >nul
    copy /y "C:\ffmpeg\ffprobe.exe" bin\ >nul 2>&1
    goto :ffmpeg_ready
)
if exist "bin\ffmpeg.exe" (
    goto :ffmpeg_ready
)

echo FFmpeg binaries are missing. Downloading FFmpeg Essentials...
if not exist "server\temp" mkdir server\temp
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip' -OutFile 'server\temp\ffmpeg.zip'"
echo Extracting FFmpeg...
powershell -Command "Expand-Archive -Path 'server\temp\ffmpeg.zip' -DestinationPath 'server\temp\ffmpeg_temp' -Force"

:: Move binaries to bin/
for /r server\temp\ffmpeg_temp %%f in (ffmpeg.exe ffprobe.exe) do (
    if exist "%%f" copy /y "%%f" bin\ >nul
)

:: Clean up
rmdir /s /q server\temp\ffmpeg_temp
del server\temp\ffmpeg.zip
echo FFmpeg installation finished.

:ffmpeg_ready
echo FFmpeg is ready.

:: 5. Check and Install Rclone
rclone version >nul 2>&1
if "%errorlevel%"=="0" goto :rclone_ready

if exist "C:\rclone\rclone.exe" (
    echo Found Rclone at C:\rclone. Copying to bin directory...
    copy /y "C:\rclone\rclone.exe" bin\ >nul
    goto :rclone_ready
)
if exist "bin\rclone.exe" (
    goto :rclone_ready
)

echo Rclone binary is missing. Downloading Rclone...
if not exist "server\temp" mkdir server\temp
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://downloads.rclone.org/rclone-current-windows-amd64.zip' -OutFile 'server\temp\rclone.zip'"
echo Extracting Rclone...
powershell -Command "Expand-Archive -Path 'server\temp\rclone.zip' -DestinationPath 'server\temp\rclone_temp' -Force"

:: Move rclone.exe to bin/
for /r server\temp\rclone_temp %%f in (rclone.exe) do (
    if exist "%%f" copy /y "%%f" bin\ >nul
)

:: Clean up
rmdir /s /q server\temp\rclone_temp
del server\temp\rclone.zip
echo Rclone installation finished.

:rclone_ready
echo Rclone is ready.

:: Ensure bin/ is in the path for python packages
set "PATH=%CD%\bin;%PATH%"

echo.
echo Installing Server Python dependencies...
python -m pip install --upgrade pip
python -m pip install -r server\requirements.txt

echo.
echo Installing Web Client Node dependencies...
cd web
call npm install
cd ..

echo.
echo ====================================================
echo        DEPENDENCIES ARE SUCCESSFULLY INSTALLED
echo            LAUNCHING SETUP CONFIGURATION...
echo ====================================================
echo.
python server\cli.py --setup

pause
