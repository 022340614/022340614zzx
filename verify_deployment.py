#!/usr/bin/env python3
# 学院失物招领系统部署验证脚本
# 学号：022340614

import os
import sys

def check_files():
    """检查所有必要的文件是否存在"""
    required_files = [
        'index.html',
        'styles.css',
        'lost-found-styles.css',
        'app.js',
        'README.md',
        'DEPLOYMENT.md',
        '.gitignore',
        '.nojekyll'
    ]
    
    optional_files = [
        'lost-and-found.html',
        'lost-found-app.js',
        'upgraded-index.html',
        'CHECKLIST.md',
        'deploy.sh',
        'deploy.ps1',
        'verify_deployment.py'
    ]
    
    print("=" * 60)
    print("学院失物招领系统部署验证")
    print("学号：022340614")
    print("=" * 60)
    
    print("\n🔍 检查必需文件...")
    all_required_exist = True
    for file in required_files:
        if os.path.exists(file):
            print(f"   ✅ {file}")
        else:
            print(f"   ❌ {file} - 文件缺失")
            all_required_exist = False
    
    print("\n📁 检查可选文件...")
    for file in optional_files:
        if os.path.exists(file):
            print(f"   ✅ {file}")
        else:
            print(f"   ⚠️  {file} - 可选文件缺失")
    
    return all_required_exist

def check_file_contents():
    """检查关键文件的内容"""
    print("\n📄 检查文件内容...")
    
    # 检查index.html是否引用了正确的CSS和JS
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            content = f.read()
            
        checks = [
            ('引用styles.css', 'href="styles.css"' in content),
            ('引用lost-found-styles.css', 'href="lost-found-styles.css"' in content),
            ('引用app.js', 'src="app.js"' in content),
            ('包含Font Awesome', 'font-awesome' in content.lower()),
            ('包含学号022340614', '022340614' in content)
        ]
        
        for check_name, check_result in checks:
            if check_result:
                print(f"   ✅ {check_name}")
            else:
                print(f"   ❌ {check_name}")
                
    except Exception as e:
        print(f"   ❌ 无法读取index.html: {e}")
    
    # 检查README.md是否包含必要信息
    try:
        with open('README.md', 'r', encoding='utf-8') as f:
            content = f.read()
            
        if '022340614' in content and 'GitHub Pages' in content:
            print("   ✅ README.md包含必要信息")
        else:
            print("   ⚠️  README.md可能缺少必要信息")
            
    except Exception as e:
        print(f"   ❌ 无法读取README.md: {e}")

def check_deployment_ready():
    """检查是否准备好部署"""
    print("\n🚀 部署准备检查...")
    
    # 检查文件大小
    files_to_check = ['index.html', 'styles.css', 'lost-found-styles.css', 'app.js']
    for file in files_to_check:
        try:
            size = os.path.getsize(file)
            if size > 0:
                print(f"   ✅ {file} ({size} 字节)")
            else:
                print(f"   ❌ {file} - 文件为空")
        except Exception as e:
            print(f"   ❌ {file} - 无法检查: {e}")
    
    # 检查.nojekyll文件
    if os.path.exists('.nojekyll'):
        print("   ✅ .nojekyll文件存在")
    else:
        print("   ❌ .nojekyll文件缺失 - GitHub Pages需要此文件")
    
    # 检查.gitignore文件
    if os.path.exists('.gitignore'):
        print("   ✅ .gitignore文件存在")
    else:
        print("   ⚠️  .gitignore文件缺失")

def main():
    """主函数"""
    print("正在验证学院失物招领系统部署准备...\n")
    
    # 检查是否在正确的目录
    if not os.path.exists('index.html'):
        print("错误：请在022340614-repo目录中运行此脚本")
        return False
    
    # 执行检查
    files_ok = check_files()
    check_file_contents()
    check_deployment_ready()
    
    print("\n" + "=" * 60)
    
    if files_ok:
        print("✅ 所有必需文件都存在！")
        print("\n下一步：")
        print("1. 运行部署脚本:")
        print("   - Windows: 运行 deploy.ps1")
        print("   - Linux/macOS: 运行 ./deploy.sh")
        print("\n2. 或手动部署:")
        print("   git init")
        print("   git add .")
        print("   git commit -m '部署学院失物招领系统'")
        print("   git branch -M main")
        print("   git remote add origin https://github.com/022340614/022340614zzx.git")
        print("   git push -u origin main")
        print("\n3. 启用GitHub Pages:")
        print("   - 访问 https://github.com/022340614/022340614zzx/settings/pages")
        print("   - 分支选择 'main'，文件夹选择 '/ (root)'")
        print("   - 点击 Save")
        print("\n4. 访问网站:")
        print("   https://022340614.github.io/022340614zzx/")
        return True
    else:
        print("❌ 缺少必需文件，请检查以上错误")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)