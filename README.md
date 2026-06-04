# 学院失物招领系统

一个基于Web的校园失物招领平台，支持用户注册登录、发布启事、搜索筛选、留言沟通和管理员后台管理功能。

## 功能特性

### 用户功能
- ✅ 用户注册与登录
- ✅ 发布失物/招领启事
- ✅ 上传物品图片
- ✅ 搜索和筛选启事
- ✅ 查看启事详情
- ✅ 留言沟通功能
- ✅ 个人中心管理

### 管理员功能
- ✅ 管理员登录
- ✅ 启事审核管理
- ✅ 用户管理
- ✅ 系统数据统计
- ✅ 系统设置

### 技术特性
- ✅ 响应式设计，支持移动端
- ✅ 深色/浅色主题切换
- ✅ 本地存储数据持久化
- ✅ 实时数据更新
- ✅ 友好的用户界面

## 文件结构

```
022340614-repo/
├── index.html          # 主页面
├── styles.css          # 基础样式
├── lost-found-styles.css # 失物招领系统样式
├── app.js              # 主应用逻辑
├── lost-found-app.js   # 原始应用逻辑（备份）
├── lost-and-found.html # 原始HTML文件（备份）
├── README.md           # 说明文档
└── .nojekyll           # GitHub Pages配置
```

## 部署到GitHub Pages

### 步骤1：创建GitHub仓库
1. 访问 https://github.com/new
2. 创建新仓库：`022340614zzx`
3. 选择公开仓库
4. 不初始化README.md（因为已有文件）

### 步骤2：上传文件到GitHub
```bash
# 克隆仓库到本地
git clone https://github.com/022340614/022340614zzx.git
cd 022340614zzx

# 复制所有文件到仓库目录
cp -r ../022340614-repo/* .

# 添加文件到Git
git add .

# 提交更改
git commit -m "初始提交：学院失物招领系统"

# 推送到GitHub
git push origin main
```

### 步骤3：启用GitHub Pages
1. 访问仓库设置：https://github.com/022340614/022340614zzx/settings
2. 左侧菜单选择 "Pages"
3. 在 "Source" 部分选择 "Deploy from a branch"
4. 分支选择 "main"，文件夹选择 "/ (root)"
5. 点击 "Save"

### 步骤4：访问网站
等待几分钟后，访问：https://022340614.github.io/022340614zzx/

## 本地运行

### 方法1：直接打开HTML文件
直接双击 `index.html` 文件在浏览器中打开。

### 方法2：使用本地服务器
```bash
# 使用Python启动本地服务器
python -m http.server 8000

# 或者使用Node.js的http-server
npx http-server
```

然后在浏览器中访问：http://localhost:8000

## 使用说明

### 普通用户
1. **注册/登录**：点击右上角登录/注册按钮
2. **发布启事**：点击导航栏"发布启事"
3. **搜索物品**：在首页搜索框输入关键词
4. **查看详情**：点击任何启事卡片查看详情
5. **留言沟通**：在启事详情页留言

### 管理员
1. **管理员登录**：点击"管理后台"，使用账号：`admin`，密码：`admin123`
2. **审核启事**：在"待审核"标签页管理启事
3. **用户管理**：在"用户管理"标签页管理用户
4. **系统设置**：在"系统设置"标签页配置系统

## 技术栈

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **样式**：CSS变量、Flexbox、Grid布局
- **存储**：LocalStorage本地存储
- **图标**：Font Awesome 6.4.0
- **字体**：系统字体栈

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Android Chrome 60+

## 开发说明

### 数据存储
- 使用LocalStorage存储用户数据、启事数据
- 数据键名：`lostAndFound_notices`, `lostAndFound_users`
- 支持离线使用

### 主题系统
- 支持深色/浅色主题切换
- 使用CSS变量定义主题颜色
- 主题偏好保存在LocalStorage中

### 响应式设计
- 移动端优先设计
- 适配各种屏幕尺寸
- 触摸友好的交互设计

## 测试账号

### 普通用户
- 用户名：张三
- 密码：任意（演示用）

### 管理员
- 用户名：admin
- 密码：admin123

## 许可证

本项目仅供学习使用，遵循MIT许可证。

## 联系信息

- 学号：022340614
- 项目地址：https://github.com/022340614/022340614zzx
- 在线演示：https://022340614.github.io/022340614zzx/

## 更新日志

### v1.0.0 (2024-06-04)
- ✅ 初始版本发布
- ✅ 完整的前端功能
- ✅ 响应式设计
- ✅ 本地数据存储
- ✅ GitHub Pages部署支持