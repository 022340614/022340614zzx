@echo off
echo ========================================
echo 022340614数据可视化平台 - GitHub Pages部署脚本
echo ========================================
echo.

echo 步骤1: 检查Git安装
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git未安装，请先安装Git
    echo 下载地址: https://git-scm.com/downloads
    pause
    exit /b 1
)
echo ✅ Git已安装

echo.
echo 步骤2: 检查当前目录文件
echo.
dir /b
echo.

echo 步骤3: 初始化Git仓库（如果尚未初始化）
if not exist ".git" (
    echo 初始化Git仓库...
    git init
    git add .
    git commit -m "初始提交 - 022340614数据可视化平台"
    echo ✅ Git仓库初始化完成
) else (
    echo ✅ Git仓库已存在
)

echo.
echo 步骤4: 添加远程仓库（如果需要）
echo 请确保已设置远程仓库:
echo git remote add origin https://github.com/022340614/022340614zzx.git
echo 或使用现有远程仓库:
git remote -v
echo.

echo 步骤5: 提交更改
git add .
git commit -m "修复数据可视化平台功能 - 优化数据加载和错误处理"
echo ✅ 更改已提交

echo.
echo 步骤6: 推送到GitHub
echo 正在推送到GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    git push -u origin master
)

echo.
echo 步骤7: 启用GitHub Pages（如果尚未启用）
echo.
echo 请按照以下步骤启用GitHub Pages:
echo 1. 访问 https://github.com/022340614/022340614zzx/settings/pages
echo 2. 在"Source"部分选择"main"分支
echo 3. 选择"/ (root)"文件夹
echo 4. 点击"Save"
echo.
echo 步骤8: 访问您的网站
echo 网站URL: https://022340614.github.io/022340614zzx/
echo.
echo 步骤9: 测试网站功能
echo 1. 打开 https://022340614.github.io/022340614zzx/
echo 2. 检查图表是否正常显示
echo 3. 测试所有导航按钮
echo 4. 验证数据加载状态
echo.
echo 部署完成！
echo.
echo 如果遇到问题，请检查:
echo 1. GitHub仓库设置中的Pages配置
echo 2. 确保所有文件已推送到仓库
echo 3. 等待几分钟让GitHub Pages生效
echo.
pause