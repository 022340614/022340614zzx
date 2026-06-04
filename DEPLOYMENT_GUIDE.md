# 学院失物招领系统 - 部署指南

## 项目概述
这是一个完整的校园失物招领平台，具有以下功能：
- 用户注册登录系统
- 发布失物/招领启事
- 搜索和筛选功能
- 留言沟通系统
- 管理员后台管理
- 响应式设计，支持移动端
- 本地数据存储（LocalStorage）

## 文件结构
```
022340614-repo/
├── index.html              # 主页面
├── styles.css              # 基础样式
├── lost-found-styles.css   # 失物招领系统样式
├── app.js                  # 主应用逻辑
├── lost-and-found.html     # 原始HTML文件（备份）
├── lost-found-app.js       # 原始应用逻辑（备份）
├── upgraded-index.html     # 升级版HTML（备份）
├── README.md               # 项目说明文档
├── DEPLOYMENT.md           # 部署说明
├── CHECKLIST.md            # 检查清单
├── .gitignore              # Git忽略文件
├── .nojekyll               # GitHub Pages配置
├── deploy.sh               # Linux/Mac部署脚本
├── deploy.ps1              # Windows PowerShell部署脚本
├── verify.bat              # Windows验证脚本
└── verify_deployment.py    # Python验证脚本
```

## 部署到GitHub Pages

### 方法1：使用部署脚本（推荐）

#### Windows系统：
1. 右键点击 `deploy.ps1` 文件
2. 选择"使用PowerShell运行"
3. 按照提示操作

或者打开PowerShell，运行：
```powershell
cd 022340614-repo
powershell -ExecutionPolicy Bypass -File deploy.ps1
```

#### Linux/Mac系统：
```bash
cd 022340614-repo
chmod +x deploy.sh
./deploy.sh
```

### 方法2：手动部署

#### 步骤1：创建GitHub仓库
1. 访问 https://github.com/new
2. 创建新仓库：`022340614zzx`
3. 选择公开仓库
4. **不要**初始化README.md（因为已有文件）

#### 步骤2：初始化Git并上传文件
```bash
# 进入项目目录
cd 022340614-repo

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "部署学院失物招领系统 - 学号：022340614"

# 连接到GitHub仓库
git remote add origin https://github.com/022340614/022340614zzx.git

# 重命名分支为main
git branch -M main

# 推送到GitHub
git push -u origin main
```

#### 步骤3：启用GitHub Pages
1. 访问仓库设置：https://github.com/022340614/022340614zzx/settings
2. 左侧菜单选择 "Pages"
3. 在 "Source" 部分选择 "Deploy from a branch"
4. 分支选择 "main"，文件夹选择 "/ (root)"
5. 点击 "Save"

#### 步骤4：访问网站
等待1-2分钟后，访问：https://022340614.github.io/022340614zzx/

## 本地运行

### 方法1：直接打开
直接双击 `index.html` 文件在浏览器中打开。

### 方法2：使用本地服务器
```bash
# 使用Python
cd 022340614-repo
python -m http.server 8000

# 访问 http://localhost:8000
```

```bash
# 使用Node.js的http-server
cd 022340614-repo
npx http-server

# 访问 http://localhost:8080
```

## 功能测试

### 普通用户功能
1. **注册/登录**：点击右上角登录/注册按钮
2. **发布启事**：点击导航栏"发布启事"
3. **搜索物品**：在首页搜索框输入关键词
4. **查看详情**：点击任何启事卡片查看详情
5. **留言沟通**：在启事详情页留言

### 管理员功能
1. **管理员登录**：点击"管理后台"，使用账号：`admin`，密码：`admin123`
2. **审核启事**：在"待审核"标签页管理启事
3. **用户管理**：在"用户管理"标签页管理用户
4. **系统设置**：在"系统设置"标签页配置系统

## 测试账号

### 普通用户
- 用户名：张三
- 密码：任意（演示用）

### 管理员
- 用户名：admin
- 密码：admin123

## 技术特性

### 前端技术
- HTML5, CSS3, JavaScript (ES6+)
- CSS变量、Flexbox、Grid布局
- 响应式设计，移动端优先
- Font Awesome 6.4.0图标库

### 数据存储
- 使用LocalStorage存储用户数据、启事数据
- 数据键名：`lostAndFound_notices`, `lostAndFound_users`
- 支持离线使用

### 主题系统
- 支持深色/浅色主题切换
- 使用CSS变量定义主题颜色
- 主题偏好保存在LocalStorage中

## 浏览器兼容性
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Android Chrome 60+

## 故障排除

### 问题1：GitHub Pages不显示网站
1. 检查 `.nojekyll` 文件是否存在
2. 确保文件在根目录
3. 等待几分钟让GitHub Pages构建完成

### 问题2：本地运行样式丢失
1. 检查文件路径是否正确
2. 使用本地服务器而不是直接打开HTML文件
3. 检查浏览器控制台是否有错误

### 问题3：数据不保存
1. 检查浏览器是否支持LocalStorage
2. 检查是否有浏览器扩展阻止LocalStorage
3. 尝试使用隐私模式测试

## 更新日志

### v1.0.0 (2024-06-04)
- ✅ 初始版本发布
- ✅ 完整的前端功能
- ✅ 响应式设计
- ✅ 本地数据存储
- ✅ GitHub Pages部署支持
- ✅ 管理员后台
- ✅ 用户认证系统
- ✅ 搜索筛选功能
- ✅ 留言沟通系统

## 联系信息
- 学号：022340614
- 项目地址：https://github.com/022340614/022340614zzx
- 在线演示：https://022340614.github.io/022340614zzx/

## 许可证
本项目仅供学习使用，遵循MIT许可证。