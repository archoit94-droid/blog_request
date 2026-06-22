@echo off
chcp 65001
cd /d "%~dp0"
start http://localhost:4321
npx serve -p 4321 .
