@echo off
chcp 65001 > nul
set GIT="C:\Program Files\Git\cmd\git.exe"
cd /d "%~dp0"
%GIT% config --global user.email "firewood200@gmail.com"
%GIT% config --global user.name "firewood200-lang"
%GIT% add index.html
%GIT% commit -m "fix: version display 2026-06-29"
%GIT% push --force
echo.
echo Done!
pause
