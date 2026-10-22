@echo off
title CBA WRO Tracker - Servidor Local
cd /d "%~dp0"

echo ========================================================
echo          INICIANDO CBA WRO TRACKER VENEZUELA
echo ========================================================
echo.

if not exist "node_modules\" (
    echo [INFO] Primera ejecucion detectada. Instalando dependencias...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Error al instalar dependencias con npm.
        pause
        exit /b %errorlevel%
    )
)

echo [INFO] Iniciando servidor Vite en modo desarrollo...
echo [INFO] Para detener el servidor ejecuta detener.bat o pulsa Ctrl+C en esta consola.
echo.

call npm run dev -- --open
pause
