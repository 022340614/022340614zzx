@echo off
echo ========================================
echo 湖北民族大学失物招领PWA应用部署脚本
echo ========================================
echo.

echo [1/4] 检查Git环境...
git --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Git，请先安装Git
    pause
    exit /b 1
)

echo [2/4] 检查当前目录...
if not exist "index.html" (
    echo 错误: 请在项目根目录运行此脚本
    pause
    exit /b 1
)

echo [3/4] 添加文件到Git...
git add .

echo [4/4] 提交并推送到GitHub...
set /p commit_msg="请输入提交信息: "
git commit -m "%commit_msg%"
git push origin main

echo.
echo ========================================
echo 部署完成！
echo 应用地址: https://022340614.github.io/022340614zzx/
echo ========================================
echo.
pause