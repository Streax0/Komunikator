@echo off
setlocal EnableExtensions

for %%I in ("%~dp0.") do set "PROJECT_DIR=%%~fI"
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
set "CONFIG_FILE=%XAMPP_DIR%\apache\conf\komunikator-folder.conf"
set "INCLUDE_LINE=IncludeOptional "%CONFIG_FILE:\=/%""

>"%CONFIG_FILE%" echo Alias /komunikator "%PROJECT_DIR:\=/%"
if errorlevel 1 (
    echo Nie udalo sie zapisac konfiguracji Apache:
    echo %CONFIG_FILE%
    pause
    exit /b 1
)
>>"%CONFIG_FILE%" echo.
>>"%CONFIG_FILE%" echo ^<Directory "%PROJECT_DIR:\=/%"^>
>>"%CONFIG_FILE%" echo     Options Indexes FollowSymLinks
>>"%CONFIG_FILE%" echo     AllowOverride All
>>"%CONFIG_FILE%" echo     Require all granted
>>"%CONFIG_FILE%" echo     DirectoryIndex index.php index.html
>>"%CONFIG_FILE%" echo ^</Directory^>

findstr /L /C:"komunikator-folder.conf" "%HTTPD_CONF%" >nul 2>&1
if errorlevel 1 (
    if not exist "%HTTPD_CONF%.before-komunikator" (
        copy /Y "%HTTPD_CONF%" "%HTTPD_CONF%.before-komunikator" >nul
        if errorlevel 1 (
            echo Nie udalo sie wykonac kopii zapasowej konfiguracji Apache.
            pause
            exit /b 1
        )
    )
    >>"%HTTPD_CONF%" echo.
    >>"%HTTPD_CONF%" echo %INCLUDE_LINE%
    findstr /L /C:"komunikator-folder.conf" "%HTTPD_CONF%" >nul 2>&1
    if errorlevel 1 (
        echo Nie udalo sie dodac konfiguracji folderu do Apache.
        pause
        exit /b 1
    )
    echo Dodano konfiguracje Komunikatora do XAMPP.
) else (
    echo Konfiguracja Komunikatora jest juz dodana.
)

"%XAMPP_DIR%\apache\bin\httpd.exe" -t -f "%HTTPD_CONF%"
if errorlevel 1 (
    echo.
    echo Konfiguracja Apache zawiera blad. Przywroc kopie:
    echo %HTTPD_CONF%.before-komunikator
    pause
    exit /b 1
)

echo.
echo Apache uruchamia strone z folderu:
echo %PROJECT_DIR%
echo Adres: http://localhost/komunikator/
echo.
netstat -ano | findstr /C:":80 " | findstr /C:"LISTENING" >nul
if errorlevel 1 (
    powershell.exe -NoProfile -Command "Start-Process -FilePath (Join-Path $env:XAMPP_DIR 'apache\bin\httpd.exe') -ArgumentList ('-f ' + [char]34 + $env:HTTPD_CONF + [char]34) -WindowStyle Hidden"
    if errorlevel 1 (
        echo Nie udalo sie uruchomic Apache.
        pause
        exit /b 1
    )
    timeout /t 6 /nobreak >nul
    netstat -ano | findstr /C:":80 " | findstr /C:"LISTENING" >nul
    if errorlevel 1 (
        echo Apache nie uruchomil sie na porcie 80.
        pause
        exit /b 1
    )
) else (
    echo Apache juz dziala. Sprawdzam adres strony...
    curl.exe --silent --output nul --write-out "%%{http_code}" "http://localhost/komunikator/" | findstr /X /C:"404" >nul
    if not errorlevel 1 (
        echo.
        echo Apache nadal zwraca 404 dla strony Komunikatora.
        echo Zatrzymaj i uruchom ponownie Apache w panelu XAMPP.
        pause
        exit /b 1
    )
)

start "" "http://localhost/komunikator/"
endlocal
goto :eof
