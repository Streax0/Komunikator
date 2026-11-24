@echo off
setlocal

where git >nul 2>&1
if errorlevel 1 (
    set "GIT_EXE=C:\Users\student\AppData\Local\Programs\Git\cmd\git.exe"
) else (
    set "GIT_EXE=git"
)

echo Usuwanie zapisanego logowania GitHub...
(echo protocol=https& echo host=github.com& echo.& echo.) | "%GIT_EXE%" credential reject

if errorlevel 1 (
    echo Nie udalo sie usunac danych logowania.
    pause
    exit /b 1
)

echo.
echo Wylogowano z GitHub dla polaczen Git przez HTTPS.
echo.
pause
endlocal
