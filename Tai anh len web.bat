@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

echo.
echo   ================================================
echo     TAI ANH SAN PHAM LEN WEB - KEO GAMING SHOP
echo   ================================================
echo.

if "%~1"=="" (
  echo   Chua co thu muc nao.
  echo.
  echo   CACH DUNG: keo thu muc anh tha len chinh file nay.
  echo.
  echo   Thu muc phai co dang:
  echo       Anh gear\
  echo         Finalmouse Tarik\      ^<- ten thu muc = ten san pham
  echo             anh1.jpg
  echo             anh2.jpg
  echo         Razer Viper v3 pro\
  echo             ...
  echo.
  pause
  exit /b 1
)

call node scripts\thu-cong.mjs %*
if errorlevel 1 goto :loi

pause
exit /b 0

:loi
pause
exit /b 1
