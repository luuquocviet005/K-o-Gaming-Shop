@echo off
chcp 65001 >nul
setlocal

REM Bat che do tu dong: cu 15 phut Windows se tu kiem tra thu muc anh,
REM nen anh moi va dua len web. Chi can chay file nay MOT LAN.

set "DUAN=%~dp0"
if "%DUAN:~-1%"=="\" set "DUAN=%DUAN:~0,-1%"

echo.
echo   ============================================
echo    KEO GAMING SHOP - Bat che do tu dong
echo   ============================================
echo.

schtasks /Query /TN "KeoGamingShop-NapAnh" >nul 2>&1
if %errorlevel%==0 (
  echo   Che do tu dong DA BAT tu truoc. Dang cap nhat lai...
  schtasks /Delete /TN "KeoGamingShop-NapAnh" /F >nul 2>&1
)

schtasks /Create ^
  /TN "KeoGamingShop-NapAnh" ^
  /TR "wscript.exe \"%DUAN%\scripts\chay-ngam.vbs\"" ^
  /SC MINUTE /MO 15 ^
  /F >nul

if %errorlevel% neq 0 (
  echo   [X] Khong bat duoc.
  echo.
  echo   Cach xu ly: bam chuot phai vao file nay,
  echo   chon "Run as administrator" roi thu lai.
  echo.
  pause
  exit /b 1
)

echo   [OK] Da bat che do tu dong.
echo.
echo   Tu gio ban chi can:
echo     1. Bo anh vao thu muc anh (chia theo danh muc nhu cu)
echo     2. Cho toi da 15 phut - web tu cap nhat
echo.
echo   Ket qua moi lan chay ghi trong file "BAO CAO.txt"
echo   nam ngay trong thu muc anh cua ban.
echo.
echo   Muon tat: chay file "Tat tu dong.bat"
echo.
echo   Dang chay thu ngay bay gio de kiem tra...
echo.

schtasks /Run /TN "KeoGamingShop-NapAnh" >nul 2>&1
if %errorlevel%==0 (echo   [OK] Da chay thu. Xem "BAO CAO.txt" sau vai phut.) else (echo   [!] Chua chay thu duoc, nhung lich 15 phut van hoat dong.)

echo.
pause
