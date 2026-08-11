@echo off
chcp 65001 >nul

REM Tat che do tu dong. Sau khi tat, muon dua anh len web thi
REM keo tha thu muc anh vao "Tai anh len web.bat" nhu truoc.

echo.
echo   ============================================
echo    KEO GAMING SHOP - Tat che do tu dong
echo   ============================================
echo.

schtasks /Query /TN "KeoGamingShop-NapAnh" >nul 2>&1
if %errorlevel% neq 0 (
  echo   Che do tu dong von da tat san.
  echo.
  pause
  exit /b 0
)

schtasks /Delete /TN "KeoGamingShop-NapAnh" /F >nul
if %errorlevel%==0 (
  echo   [OK] Da tat. Windows se khong tu chay nua.
  echo.
  echo   Muon dua anh len web: keo tha thu muc anh
  echo   vao file "Tai anh len web.bat"
) else (
  echo   [X] Khong tat duoc. Bam chuot phai file nay
  echo       roi chon "Run as administrator".
)

echo.
pause
