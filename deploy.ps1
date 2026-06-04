# 学院失物招领系统部署脚本 - PowerShell版本
# 学号：022340614

Write-Host "=== 学院失物招领系统部署脚本 ===" -ForegroundColor Cyan
Write-Host "学号：022340614" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# 检查是否在正确的目录
if (-not (Test-Path "index.html")) {
    Write-Host "错误：请在项目根目录（022340614-repo）中运行此脚本" -ForegroundColor Red
    exit 1
}

Write-Host "1. 检查项目文件..." -ForegroundColor Green
$files = @("index.html", "styles.css", "lost-found-styles.css", "app.js", "README.md", "DEPLOYMENT.md", ".gitignore", ".nojekyll")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "   - $file: ✓" -ForegroundColor Green
    } else {
        Write-Host "   - $file: ✗" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "2. 初始化Git仓库..." -ForegroundColor Green
if (-not (Test-Path ".git")) {
    git init
    Write-Host "   Git仓库已初始化" -ForegroundColor Green
} else {
    Write-Host "   Git仓库已存在" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "3. 添加文件到Git..." -ForegroundColor Green
git add .

Write-Host ""
Write-Host "4. 提交更改..." -ForegroundColor Green
git commit -m "部署学院失物招领系统 - 学号：022340614"

Write-Host ""
Write-Host "5. 连接到GitHub仓库..." -ForegroundColor Green
Write-Host "   请确保已创建GitHub仓库：https://github.com/022340614/022340614zzx" -ForegroundColor Yellow

$response = Read-Host "   是否已创建仓库？(y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "   添加远程仓库..." -ForegroundColor Green
    git remote add origin https://github.com/022340614/022340614zzx.git 2>$null
    if ($LASTEXITCODE -ne 0) {
        git remote set-url origin https://github.com/022340614/022340614zzx.git
    }
    
    Write-Host ""
    Write-Host "6. 推送到GitHub..." -ForegroundColor Green
    git branch -M main
    git push -u origin main
    
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "部署完成！" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步：" -ForegroundColor Yellow
    Write-Host "1. 访问 https://github.com/022340614/022340614zzx" -ForegroundColor White
    Write-Host "2. 点击 Settings → Pages" -ForegroundColor White
    Write-Host "3. 在 Source 部分选择 'Deploy from a branch'" -ForegroundColor White
    Write-Host "4. 分支选择 'main'，文件夹选择 '/ (root)'" -ForegroundColor White
    Write-Host "5. 点击 Save" -ForegroundColor White
    Write-Host ""
    Write-Host "网站将在几分钟后可通过以下地址访问：" -ForegroundColor Yellow
    Write-Host "https://022340614.github.io/022340614zzx/" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "请先创建GitHub仓库：" -ForegroundColor Yellow
    Write-Host "1. 访问 https://github.com/new" -ForegroundColor White
    Write-Host "2. 创建仓库：022340614zzx" -ForegroundColor White
    Write-Host "3. 然后重新运行此脚本" -ForegroundColor White
    Write-Host "==================================" -ForegroundColor Cyan
}