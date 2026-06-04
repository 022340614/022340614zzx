@echo off
echo ========================================
echo 学院失物招领系统 - 一键部署脚本
echo 学号：022340614
echo ========================================
echo.

echo 步骤1: 检查必要文件...
if not exist "index.html" (
    echo ❌ 错误: 找不到 index.html 文件
    pause
    exit /b 1
)

if not exist "app.js" (
    echo ❌ 错误: 找不到 app.js 文件
    pause
    exit /b 1
)

if not exist "styles.css" (
    echo ❌ 错误: 找不到 styles.css 文件
    pause
    exit /b 1
)

if not exist "lost-found-styles.css" (
    echo ❌ 错误: 找不到 lost-found-styles.css 文件
    pause
    exit /b 1
)

echo ✅ 所有必要文件检查通过
echo.

echo 步骤2: 创建部署包...
if exist "deploy-package" (
    echo 删除旧的部署包...
    rmdir /s /q "deploy-package"
)

mkdir "deploy-package"

echo 复制文件到部署包...
copy "index.html" "deploy-package\"
copy "styles.css" "deploy-package\"
copy "lost-found-styles.css" "deploy-package\"
copy "app.js" "deploy-package\"
copy "manifest.json" "deploy-package\"
copy "sw.js" "deploy-package\"
copy "README.md" "deploy-package\"
copy "DEPLOYMENT.md" "deploy-package\"
copy "CHECKLIST.md" "deploy-package\"
copy ".nojekyll" "deploy-package\"
copy ".gitignore" "deploy-package\"

echo ✅ 部署包创建完成
echo.

echo 步骤3: 验证部署包...
dir "deploy-package" /b
echo.
echo 总文件数: 
dir "deploy-package" /b | find /c /v ""
echo.

echo ========================================
echo 部署说明
echo ========================================
echo.
echo 您的学院失物招领系统已准备就绪！
echo.
echo 请按以下步骤部署到GitHub Pages：
echo.
echo 1. 访问GitHub仓库：
echo    https://github.com/022340614/022340614zzx
echo.
echo 2. 上传文件到GitHub：
echo    - 点击 "Add file" → "Upload files"
echo    - 将 "deploy-package" 文件夹中的所有文件拖拽到上传区域
echo    - 提交信息填写："部署学院失物招领系统"
echo    - 点击 "Commit changes"
echo.
echo 3. 启用GitHub Pages：
echo    - 进入仓库 Settings → Pages
echo    - Source选择：main 分支
echo    - Folder选择：/ (root)
echo    - 点击 Save
echo.
echo 4. 等待1-2分钟，然后访问：
echo    https://022340614.github.io/022340614zzx/
echo.
echo ========================================
echo 功能验证
echo ========================================
echo.
echo 部署完成后，请验证以下功能：
echo.
echo ✅ 用户注册登录
echo ✅ 发布失物/招领启事
echo ✅ 搜索和筛选启事
echo ✅ 查看启事详情
echo ✅ 留言沟通功能
echo ✅ 管理员后台管理
echo ✅ 响应式设计
echo ✅ 本地数据存储
echo.
echo ========================================
echo 测试账号
echo ========================================
echo.
echo 普通用户：
echo - 用户名：张三
echo - 密码：任意（演示用）
echo.
echo 管理员：
echo - 用户名：admin
echo - 密码：admin123
echo.
echo ========================================
echo 技术支持
echo ========================================
echo.
echo 如果遇到问题，请参考：
echo 1. DEPLOYMENT.md - 详细部署指南
echo 2. CHECKLIST.md - 部署检查清单
echo 3. README.md - 使用说明
echo.
echo 按任意键打开部署文件夹...
pause >nul

explorer "deploy-package"
echo.
echo 部署文件夹已打开！
echo 请按照上述说明上传文件到GitHub。
echo.
echo 按任意键退出...
pause >nul