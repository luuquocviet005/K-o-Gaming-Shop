@echo off
chcp 65001 >nul
cd /d "%~dp0"

REM Giai nen ngay moi file .zip trong thu muc anh roi xoa file .zip.
REM Che do tu dong cung tu lam viec nay 5 phut mot lan - file nay chi
REM de khoi phai cho.

echo.
echo   ============================================
echo    KEO GAMING SHOP - Giai nen file .zip
echo   ============================================

call node scripts\giai-nen-ngay.mjs

pause
