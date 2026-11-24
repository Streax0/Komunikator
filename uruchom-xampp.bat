@echo off
setlocal EnableExtensions

set "PROJECT_DIR=C:\Users\student\Desktop\Nowy folder"
set "CONFIG_FILE=%PROJECT_DIR%\xampp-folder.conf"
set "XAMPP_DIR="

for %%D in (
    "C:\xampp"
    "C:\Program Files\xampp"
    "C:\Program Files (x86)\xampp"
) do (
    if not defined XAMPP_DIR if exist "%%~D\apache\bin\httpd.exe" set "XAMPP_DIR=%%~D"
)

if not defined XAMPP_DIR (
    echo Nie znaleziono XAMPP. Zainstaluj go w C:\xampp albo popraw liste sciezek w tym pliku.
    pause
    exit /b 1
)

set "HTTPD_CONF=%XAMPP_DIR%\apache\conf\httpd.conf"
set "INCLUDE_LINE=IncludeOptional "C:/Users/student/Desktop/Nowy folder/xampp-folder.conf""

findstr /L /C:"xampp-folder.conf" "%HTTPD_CONF%" >nul 2>&1
if errorlevel 1 (
    copy /Y "%HTTPD_CONF%" "%HTTPD_CONF%.before-nowy-folder" >nul
    >>"%HTTPD_CONF%" echo.
    >>"%HTTPD_CONF%" echo %INCLUDE_LINE%
    echo Dodano konfiguracje folderu do XAMPP.
) else (
    echo Konfiguracja folderu jest juz dodana.
)

"%XAMPP_DIR%\apache\bin\httpd.exe" -t -f "%HTTPD_CONF%"
if errorlevel 1 (
    echo.
    echo Konfiguracja Apache zawiera blad. Przywroc kopie:
    echo %HTTPD_CONF%.before-nowy-folder
    pause
    exit /b 1
)

echo.
echo Apache uruchamia strone z folderu:
echo %PROJECT_DIR%
echo Adres: http://localhost/nowy-folder/
echo.
netstat -ano | findstr /C:":80 " | findstr /C:"LISTENING" >nul
if errorlevel 1 (
    start "" /B "%XAMPP_DIR%\apache\bin\httpd.exe" -f "%HTTPD_CONF%"
    timeout /t 2 /nobreak >nul
) else (
    echo Apache juz dziala na porcie 80.
)

start "" "http://localhost/nowy-folder/"
endlocal
