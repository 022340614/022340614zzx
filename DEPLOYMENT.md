# 部署指南：学院失物招领系统到GitHub Pages

## 快速部署步骤

### 方法1：使用Git命令行

#### 步骤1：初始化Git仓库
```bash
# 进入项目目录
cd 022340614-repo

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "初始提交：学院失物招领系统"
```

#### 步骤2：连接到GitHub仓库
```bash
# 添加远程仓库（替换为你的仓库URL）
git remote add origin https://github.com/022340614/022340614zzx.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 方法2：使用GitHub Desktop

1. 下载并安装 [GitHub Desktop](https://desktop.github.com/)
2. 打开GitHub Desktop，选择 "File" → "Add Local Repository"
3. 选择 `022340614-repo` 文件夹
4. 填写提交信息："初始提交：学院失物招领系统"
5. 点击 "Commit to main"
6. 点击 "Publish repository"
7. 输入仓库名称：`022340614zzx`
8. 选择 "Public"（公开）
9. 点击 "Publish Repository"

### 方法3：直接上传到GitHub

1. 访问 https://github.com/022340614/022340614zzx
2. 点击 "Add file" → "Upload files"
3. 将 `022340614-repo` 文件夹中的所有文件拖到上传区域
4. 填写提交信息："初始提交：学院失物招领系统"
5. 点击 "Commit changes"

## 启用GitHub Pages

### 步骤1：访问仓库设置
1. 进入你的GitHub仓库：https://github.com/022340614/022340614zzx
2. 点击 "Settings"（设置）

### 步骤2：配置Pages
1. 在左侧菜单中找到 "Pages"
2. 在 "Source" 部分选择 "Deploy from a branch"
3. 分支选择 "main"
4. 文件夹选择 "/ (root)"
5. 点击 "Save"

### 步骤3：等待部署完成
- GitHub Pages 通常需要1-2分钟来部署
- 刷新页面查看部署状态
- 当看到绿色勾号时，表示部署成功

## 访问你的网站

部署完成后，你的网站可以通过以下URL访问：
```
https://022340614.github.io/022340614zzx/
```

## 自定义域名（可选）

如果你想使用自定义域名：

### 步骤1：购买域名
- 从域名注册商（如GoDaddy、Namecheap等）购买域名

### 步骤2：配置DNS
1. 在域名注册商的控制面板中添加CNAME记录：
   ```
   类型：CNAME
   名称：www（或留空）
   值：022340614.github.io
   TTL：自动
   ```

2. 添加A记录（如果需要根域名）：
   ```
   类型：A
   名称：@
   值：185.199.108.153
   值：185.199.109.153
   值：185.199.110.153
   值：185.199.111.153
   TTL：自动
   ```

### 步骤3：在GitHub中配置
1. 回到GitHub仓库的Pages设置
2. 在 "Custom domain" 中输入你的域名
3. 勾选 "Enforce HTTPS"
4. 点击 "Save"

## 更新网站

### 方法1：使用Git命令行
```bash
# 进入项目目录
cd 022340614-repo

# 拉取最新更改（如果有）
git pull origin main

# 修改文件后添加更改
git add .

# 提交更改
git commit -m "更新描述"

# 推送到GitHub
git push origin main
```

### 方法2：使用GitHub Desktop
1. 在GitHub Desktop中打开仓库
2. 进行更改后，GitHub Desktop会自动检测更改
3. 填写提交信息
4. 点击 "Commit to main"
5. 点击 "Push origin"

### 方法3：直接上传
1. 在GitHub仓库页面点击 "Add file" → "Upload files"
2. 上传修改后的文件
3. 填写提交信息
4. 点击 "Commit changes"

## 故障排除

### 问题1：网站无法访问
- 检查GitHub Pages是否已启用
- 确认仓库是公开的
- 等待几分钟让部署完成
- 检查URL是否正确：https://022340614.github.io/022340614zzx/

### 问题2：样式或脚本不加载
- 检查文件路径是否正确
- 确保所有文件都已上传
- 检查浏览器控制台是否有错误
- 清除浏览器缓存后重试

### 问题3：GitHub Pages显示404
- 确认 `index.html` 文件在根目录
- 检查分支设置是否正确
- 确保没有 `.nojekyll` 文件冲突
- 等待GitHub Pages完成构建

### 问题4：自定义域名不工作
- 等待DNS传播（最多24小时）
- 检查DNS记录是否正确
- 在GitHub Pages设置中重新保存自定义域名
- 确保域名已正确验证

## 高级配置

### 使用GitHub Actions自动部署
创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### 添加网站图标
1. 准备一个 `favicon.ico` 文件（尺寸：16x16, 32x32, 64x64）
2. 将文件放在项目根目录
3. 在 `index.html` 的 `<head>` 部分添加：
   ```html
   <link rel="icon" href="favicon.ico" type="image/x-icon">
   ```

### 优化网站性能
1. 压缩图片文件
2. 合并CSS和JS文件
3. 使用CDN加载外部资源
4. 启用Gzip压缩

## 技术支持

如果遇到问题，可以：

1. 查看GitHub Pages文档：https://docs.github.com/pages
2. 检查GitHub Actions日志
3. 在GitHub Issues中提问
4. 联系项目维护者

## 许可证

本项目遵循MIT许可证。详情请查看LICENSE文件。

---

**注意**：确保你的GitHub账户已验证邮箱，否则可能无法使用GitHub Pages功能。