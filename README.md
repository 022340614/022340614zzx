# 校园失物招领 PWA 应用

一个渐进式网页应用（PWA），为校园师生提供失物招领服务。

## 功能特性

### 🎯 核心功能
- **全设备响应式**：手机、平板、电脑完美适配
- **PWA 支持**：可添加到主屏幕，支持离线访问
- **发布信息**：发布寻物/招领启事，支持图片上传
- **智能搜索**：关键词、分类、时间筛选
- **留言互动**：帖子评论区交流
- **状态管理**：标记物品状态（待认领/已解决）

### 👨‍💼 管理员后台
- **内容审核**：审核用户发布的帖子
- **分类管理**：管理物品分类
- **数据统计**：查看平台数据概览
- **用户管理**：管理用户权限

### 📱 PWA 特性
- ✅ 添加到主屏幕
- ✅ Service Worker 离线缓存
- ✅ Web App Manifest
- ✅ 推送通知
- ✅ 独立应用体验

## 快速开始

### 1. 本地运行
```bash
# 克隆项目
git clone <your-repo-url>
cd pwa-lost-and-found

# 使用本地服务器运行
# 方法1：使用Python
python -m http.server 8000

# 方法2：使用Node.js
npx serve .

# 方法3：使用PHP
php -S localhost:8000
```

### 2. 访问应用
- 前台：http://localhost:8000
- 后台：http://localhost:8000/admin.html

## 部署指南

### GitHub Pages
1. 将项目推送到GitHub仓库
2. 进入仓库 Settings → Pages
3. 选择 main 分支，保存
4. 访问 https://yourusername.github.io/repo-name

### Netlify
1. 将项目推送到GitHub/GitLab
2. 登录 Netlify，选择 "New site from Git"
3. 选择仓库，直接部署
4. 自动获得 https://your-site.netlify.app

### Vercel
1. 安装 Vercel CLI：`npm i -g vercel`
2. 在项目目录运行：`vercel`
3. 按照提示完成部署

## 项目结构
```
pwa-lost-and-found/
├── index.html          # 主应用页面
├── admin.html         # 管理员后台
├── manifest.json      # PWA清单文件
├── sw.js             # Service Worker
├── styles/
│   ├── main.css      # 主样式
│   └── admin.css     # 后台样式
├── js/
│   ├── app.js        # 主应用逻辑
│   ├── pwa.js        # PWA功能
│   └── admin.js      # 后台逻辑
├── assets/           # 图标资源
└── README.md         # 说明文档
```

## 技术栈
- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **PWA**：Service Worker, Web App Manifest
- **存储**：LocalStorage（可升级为IndexedDB）
- **样式**：CSS Grid, Flexbox, 响应式设计
- **构建**：无需构建，直接部署

## 配置说明

### 1. 修改应用信息
编辑 `manifest.json`：
```json
{
  "name": "校园失物招领",
  "short_name": "失物招领",
  "theme_color": "#4CAF50",
  "background_color": "#ffffff"
}
```

### 2. 自定义样式
编辑 `styles/main.css` 中的颜色变量：
```css
:root {
  --primary-color: #4CAF50;
  --secondary-color: #45a049;
  --text-color: #333;
}
```

### 3. 添加图标
将图标文件放入 `assets/` 目录：
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-192x192.png
- icon-512x512.png

## 数据存储

### 本地存储
应用使用 LocalStorage 存储数据：
- `lostFoundItems`：失物招领帖子
- `categories`：物品分类
- `currentUser`：当前用户信息

### 数据迁移
如需迁移到服务器，修改 `js/app.js` 中的存储逻辑：
```javascript
// 替换为API调用
async function saveItem(item) {
  // 本地存储
  // localStorage.setItem('lostFoundItems', JSON.stringify(items));
  
  // 服务器存储
  const response = await fetch('/api/items', {
    method: 'POST',
    body: JSON.stringify(item)
  });
}
```

## 浏览器支持
- Chrome 54+ ✅
- Firefox 63+ ✅
- Safari 11.1+ ✅
- Edge 79+ ✅
- iOS Safari 11.3+ ✅
- Android Chrome 54+ ✅

## 开发建议

### 1. 测试PWA功能
```javascript
// 检查Service Worker
if ('serviceWorker' in navigator) {
  console.log('PWA支持良好');
}

// 检查安装状态
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('已安装到主屏幕');
}
```

### 2. 性能优化
- 图片压缩：使用 WebP 格式
- 代码分割：按需加载模块
- 缓存策略：合理配置 Service Worker

### 3. 安全考虑
- 输入验证：防止XSS攻击
- 内容过滤：审核用户输入
- HTTPS：生产环境必须使用

## 常见问题

### Q: 如何更新Service Worker？
A: 修改 `sw.js` 中的 `CACHE_NAME` 版本号。

### Q: 如何添加新分类？
A: 在管理员后台的"分类管理"中添加。

### Q: 如何备份数据？
A: 导出 LocalStorage 数据：
```javascript
localStorage.getItem('lostFoundItems');
```

### Q: 如何升级到数据库？
A: 建议使用 Firebase、Supabase 或自建API。

## 贡献指南
1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 许可证
MIT License

## 联系方式
- 项目仓库：https://github.com/022340614/022340614zzx
- 问题反馈：请提交 Issue

---

**校园失物招领平台** - 让失物更快回家 🎓✨