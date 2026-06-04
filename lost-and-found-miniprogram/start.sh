#!/bin/bash

echo "=== 校园失物招领小程序部署脚本 ==="
echo ""

# 检查是否在微信开发者工具目录
if [ ! -f "project.config.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

echo "📱 项目信息："
echo "   项目名称：校园失物招领"
echo "   版本：v1.0.0"
echo ""

echo "🚀 部署步骤："
echo "1. 打开微信开发者工具"
echo "2. 导入项目，选择当前目录"
echo "3. 在 project.config.json 中配置你的 AppID"
echo "4. 在 app.js 中配置云环境 ID"
echo "5. 上传并部署云函数"
echo "6. 调用 init-db 云函数初始化数据库"
echo "7. 编译运行"
echo ""

echo "📋 云函数列表："
echo "   - login: 获取用户 openid"
echo "   - init-db: 初始化数据库"
echo "   - cleanup: 清理过期数据"
echo ""

echo "💡 提示："
echo "   - 首次使用需要开通云开发服务"
echo "   - 建议创建测试环境和生产环境"
echo "   - 详细文档请参考 README.md 和 DEPLOYMENT.md"
echo ""

echo "✅ 脚本执行完成"
echo "   祝您使用愉快！"