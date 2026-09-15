@echo off
chcp 65001 >nul
setlocal

REM Bat che do tu dong: cu 5 phut Windows se tu kiem tra thu muc anh,
REM nen anh moi va dua len web. Chi can chay file nay MOT LAN.
REM (Ten file van ghi 15 phut cho quen tay - chu ky that la 5 phut.)

set "DUAN=%~dp0"
if "%DUAN:~-1%"=="\" set "DUAN=%DUAN:~0,-1%"

echo.
echo   ============================================
echo    KEO GAMING SHOP - Bat che do tu dong
echo   ============================================
echo.

schtasks /Query /TN "KeoGamingShop-NapAnh" >nul 2>&1
if %errorlevel%==0 (
  echo   Che do tu dong DA CO tu truoc. Dang cai lai...
  schtasks /Delete /TN "KeoGamingShop-NapAnh" /F >nul 2>&1
)

schtasks /Create ^
  /TN "KeoGamingShop-NapAnh" ^
  /TR "wscript.exe \"%DUAN%\scripts\chay-ngam.vbs\"" ^
  /SC MINUTE /MO 5 ^
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

REM schtasks khong dat duoc cac tuy chon duoi day, nen dung PowerShell:
REM  - StartWhenAvailable: may tat/ngu luc toi gio thi bat lai la chay bu ngay
REM  - chay ca khi dung pin (may xach tay)
REM  - IgnoreNew: luot truoc chua xong thi bo qua, khong chay chong
powershell -NoProfile -Command "Set-ScheduledTask -TaskName KeoGamingShop-NapAnh -Settings (New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 30))" >nul 2>&1

echo   [OK] Da bat che do tu dong.
echo.
echo   Tu gio ban chi can:
echo     1. Bo anh vao thu muc anh (chia theo danh muc nhu cu)
echo     2. Cho vai phut - web tu cap nhat (5 phut kiem tra mot lan)
echo.
echo   Ket qua moi lan chay ghi trong file "BAO CAO.txt"
echo   nam ngay trong thu muc anh cua ban.
echo.
echo   Muon tat: chay file "Tat tu dong.bat"
echo.
echo   Dang chay thu ngay bay gio de kiem tra...
echo.

schtasks /Run /TN "KeoGamingShop-NapAnh" >nul 2>&1
if %errorlevel%==0 (echo   [OK] Da chay thu. Xem "BAO CAO.txt" sau vai phut.) else (echo   [!] Chua chay thu duoc, nhung lich 5 phut van hoat dong.)

echo.
pause
