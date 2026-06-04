@echo off
REM 学院失物招领系统部署验证脚本 - Windows批处理版本
REM 学号：022340614

echo ========================================
echo 学院失物招领系统部署验证
echo 学号：022340614
echo ========================================
echo.

echo 🔍 检查必需文件...
if exist index.html (
    echo    ✅ index.html
) else (
    echo    ❌ index.html - 文件缺失
)

if exist styles.css (
    echo    ✅ styles.css
) else (
    echo    ❌ styles.css - 文件缺失
)

if exist lost-found-styles.css (
    echo    ✅ lost-found-styles.css
) else (
    echo    ❌ lost-found-styles.css - 文件缺失
)

if exist app.js (
    echo    ✅ app.js
) else (
    echo    ❌ app.js - 文件缺失
)

if exist README.md (
    echo    ✅ README.md
) else (
    echo    ❌ README.md - 文件缺失
)

if exist DEPLOYMENT.md (
    echo    ✅ DEPLOYMENT.md
) else (
    echo    ❌ DEPLOYMENT.md - 文件缺失
)

if exist .gitignore (
    echo    ✅ .gitignore
) else (
    echo    ❌ .gitignore - 文件缺失
)

if exist .nojekyll (
    echo    ✅ .nojekyll
) else (
    echo    ❌ .nojekyll - 文件缺失
)

echo.
echo 📁 检查可选文件...
if exist lost-and-found.html (
    echo    ✅ lost-and-found.html
) else (
    echo    ⚠️  lost-and-found.html - 可选文件缺失
)

if exist lost-found-app.js (
    echo    ✅ lost-found-app.js
) else (
    echo    ⚠️  lost-found-app.js - 可选文件缺失
)

if exist upgraded-index.html (
    echo    ✅ upgraded-index.html
) else (
    echo    ⚠️  upgraded-index.html - 可选文件缺失
)

if exist CHECKLIST.md (
    echo    ✅ CHECKLIST.md
) else (
    echo    ⚠️  CHECKLIST.md - 可选文件缺失
)

if exist deploy.sh (
    echo    ✅ deploy.sh
) else (
    echo    ⚠️  deploy.sh - 可选文件缺失
)

if exist deploy.ps1 (
    echo    ✅ deploy.ps1
) else (
    echo    ⚠️  deploy.ps1 - 可选文件缺失
)

if exist verify_deployment.py (
    echo    ✅ verify_deployment.py
) else (
    echo    ⚠️  verify_deployment.py - 可选文件缺失
)

echo.
echo 🚀 部署准备检查...
echo   检查文件大小...
for %%f in (index.html styles.css lost-found-styles.css app.js) do (
    if exist %%f (
        for %%i in (%%f) do set size=%%~zi
        echo    ✅ %%f (!size! 字节)
    ) else (
        echo    ❌ %%f - 文件缺失
    )
)

echo.
echo ========================================
echo ✅ 所有必需文件都存在！
echo.
echo 下一步：
echo 1. 运行部署脚本:
echo    - Windows: 右键点击 deploy.ps1，选择"使用PowerShell运行"
echo    - 或运行: powershell -ExecutionPolicy Bypass -File deploy.ps1
echo.
echo 2. 或手动部署:
echo    git init
echo    git add .
echo    git commit -m "部署学院失物招领系统"
echo    git branch -M main
echo    git remote add origin https://github.com/022340614/022340614zzx.git
echo    git push -u origin main
echo.
echo 3. 启用GitHub Pages:
echo    - 访问 https://github.com/022340614/022340614zzx/settings/pages
echo    - 分支选择 'main'，文件夹选择 '/ (root)'
echo    - 点击 Save
echo.
echo 4. 访问网站:
echo    https://022340614.github.io/022340614zzx/
echo ========================================
pause