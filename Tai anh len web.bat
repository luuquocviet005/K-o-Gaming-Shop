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

echo   [1/3] Nen anh va gan vao san pham...
call node scripts\nap-anh.mjs %*
if errorlevel 1 goto :loi

echo.
echo   [2/3] Cap nhat du lieu tu Google Sheet...
call node scripts\sync-sheet.mjs
if errorlevel 1 goto :loi

echo.
echo   [3/3] Kiem tra va dua len web...
call node scripts\push.mjs "Cap nhat anh san pham"
if errorlevel 1 goto :loi

echo.
echo   ================================================
echo     XONG. Vai phut nua anh se hien tren web.
echo   ================================================
echo.
pause
exit /b 0

:loi
echo.
echo   ================================================
echo     CO LOI - doc phan mau do o tren de biet ly do.
echo     Chua co gi duoc dua len web.
echo   ================================================
echo.
pause
exit /b 1
