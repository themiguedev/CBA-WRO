@echo off
title CBA WRO Tracker - Detener Servidor
cd /d "%~dp0"

echo ========================================================
echo          DETENIENDO SERVIDOR CBA WRO TRACKER
echo ========================================================
echo.

set FOUND=0

for %%p in (5173 5174 5175 5176) do (
    for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":%%p " ^| findstr "LISTENING"') do (
        echo [OK] Finalizando proceso en puerto %%p (PID: %%a)...
        taskkill /F /PID %%a >nul 2>&1
        set FOUND=1
    )
)

echo.
if "%FOUND%"=="1" (
    echo [EXITO] Servidor detenido correctamente.
) else (
    echo [INFO] No se encontro ningun servidor activo en los puertos de Vite (5173-5176).
)

echo.
echo Cerrando en 3 segundos...
timeout /t 3 >nul
