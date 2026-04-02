@echo off
echo ================================================
echo    Uploading CASL Project to GitHub...
echo ================================================
cd /d "C:\Users\MA\Desktop\gp"

git init
git add .
git commit -m "Cyber Attack Simulation Lab v2.0 - Graduation Project"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/Talalf1/cyber-attack-simulation-lab.git
git push -u origin main

echo.
echo ================================================
if %ERRORLEVEL% == 0 (
    echo  SUCCESS! Project uploaded to GitHub!
    echo  Link: https://github.com/Talalf1/cyber-attack-simulation-lab
) else (
    echo  Note: If asked for password, use a GitHub Token
    echo  Get token from: https://github.com/settings/tokens
)
echo ================================================
echo.
pause
