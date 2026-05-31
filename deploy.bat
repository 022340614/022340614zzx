@echo off
echo ========================================
echo 校园失物招领 PWA 应用部署脚本
echo ========================================
echo.

REM 检查必要文件
echo 检查项目文件...
if not exist "index.html" (
    echo 错误: 找不到 index.html
    pause
    exit /b 1
)

if not exist "manifest.json" (
    echo 错误: 找不到 manifest.json
    pause
    exit /b 1
)

if not exist "sw.js" (
    echo 错误: 找不到 sw.js
    pause
    exit /b 1
)

echo 项目文件检查通过 ✓
echo.

REM 创建部署包
echo 创建部署包...
if not exist "deploy" mkdir deploy

xcopy /E /I /Y "index.html" "deploy\"
xcopy /E /I /Y "admin.html" "deploy\"
xcopy /E /I /Y "manifest.json" "deploy\"
xcopy /E /I /Y "sw.js" "deploy\"
xcopy /E /I /Y "styles" "deploy\styles\"
xcopy /E /I /Y "js" "deploy\js\"
xcopy /E /I /Y "README.md" "deploy\"

REM 创建示例图标（如果不存在）
echo 检查图标文件...
if not exist "assets" mkdir assets
if not exist "assets\icon-192x192.png" (
    echo 警告: 缺少图标文件，请将图标放入 assets/ 目录
    echo 建议尺寸: 192x192, 512x512
)

if exist "assets" (
    xcopy /E /I /Y "assets" "deploy\assets\"
)

echo.
echo ========================================
echo 部署包创建完成！
echo ========================================
echo.
echo 部署包位置: deploy\
echo.
echo 部署方式:
echo 1. 将 deploy\ 目录上传到服务器
echo 2. 或使用 GitHub Pages
echo 3. 或使用 Netlify/Vercel
echo.
echo 访问地址:
echo - 前台: http://your-domain/
echo - 后台: http://your-domain/admin.html
echo.
echo 按任意键退出...
pause >nul