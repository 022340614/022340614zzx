#!/bin/bash

# 学院失物招领系统部署脚本
# 学号：022340614

echo "=== 学院失物招领系统部署脚本 ==="
echo "学号：022340614"
echo "=================================="

# 检查是否在正确的目录
if [ ! -f "index.html" ]; then
    echo "错误：请在项目根目录（022340614-repo）中运行此脚本"
    exit 1
fi

echo "1. 检查项目文件..."
echo "   - index.html: $(ls -la index.html 2>/dev/null && echo '✓' || echo '✗')"
echo "   - styles.css: $(ls -la styles.css 2>/dev/null && echo '✓' || echo '✗')"
echo "   - lost-found-styles.css: $(ls -la lost-found-styles.css 2>/dev/null && echo '✓' || echo '✗')"
echo "   - app.js: $(ls -la app.js 2>/dev/null && echo '✓' || echo '✗')"
echo "   - README.md: $(ls -la README.md 2>/dev/null && echo '✓' || echo '✗')"
echo "   - DEPLOYMENT.md: $(ls -la DEPLOYMENT.md 2>/dev/null && echo '✓' || echo '✗')"
echo "   - .gitignore: $(ls -la .gitignore 2>/dev/null && echo '✓' || echo '✗')"
echo "   - .nojekyll: $(ls -la .nojekyll 2>/dev/null && echo '✓' || echo '✗')"

echo ""
echo "2. 初始化Git仓库..."
if [ ! -d ".git" ]; then
    git init
    echo "   Git仓库已初始化"
else
    echo "   Git仓库已存在"
fi

echo ""
echo "3. 添加文件到Git..."
git add .

echo ""
echo "4. 提交更改..."
git commit -m "部署学院失物招领系统 - 学号：022340614"

echo ""
echo "5. 连接到GitHub仓库..."
echo "   请确保已创建GitHub仓库：https://github.com/022340614/022340614zzx"
read -p "   是否已创建仓库？(y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "   添加远程仓库..."
    git remote add origin https://github.com/022340614/022340614zzx.git 2>/dev/null || git remote set-url origin https://github.com/022340614/022340614zzx.git
    
    echo ""
    echo "6. 推送到GitHub..."
    git branch -M main
    git push -u origin main
    
    echo ""
    echo "=================================="
    echo "部署完成！"
    echo ""
    echo "下一步："
    echo "1. 访问 https://github.com/022340614/022340614zzx"
    echo "2. 点击 Settings → Pages"
    echo "3. 在 Source 部分选择 'Deploy from a branch'"
    echo "4. 分支选择 'main'，文件夹选择 '/ (root)'"
    echo "5. 点击 Save"
    echo ""
    echo "网站将在几分钟后可通过以下地址访问："
    echo "https://022340614.github.io/022340614zzx/"
    echo "=================================="
else
    echo ""
    echo "请先创建GitHub仓库："
    echo "1. 访问 https://github.com/new"
    echo "2. 创建仓库：022340614zzx"
    echo "3. 然后重新运行此脚本"
    echo "=================================="
fi