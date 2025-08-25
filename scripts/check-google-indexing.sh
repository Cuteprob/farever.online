#!/bin/bash

# Google 索引检查脚本
# 用于检查 bunnymarket.app 中可能被 Google 收录的外部链接

echo "=== Google 索引检查报告 ==="
echo "检查时间: $(date)"
echo "网站: bunnymarket.app"
echo ""

echo "1. 检查是否有外部游戏链接被收录:"
echo "   请在 Google 搜索中输入以下命令:"
echo "   site:bunnymarket.app inurl:sprunki.com"
echo "   site:bunnymarket.app inurl:iframe"
echo "   site:bunnymarket.app inurl:game"
echo ""

echo "2. 检查当前 robots.txt 状态:"
if [ -f "public/robots.txt" ]; then
    echo "   ✅ robots.txt 文件存在"
    echo "   Disallow 规则:"
    grep "Disallow:" public/robots.txt | head -10
else
    echo "   ❌ robots.txt 文件不存在"
fi
echo ""

echo "3. 检查项目中的外部链接:"
echo "   iframe 链接模式:"
if [ -d "scripts" ]; then
    grep -r "https://.*\.com/game/" scripts/ 2>/dev/null || echo "   未找到外部游戏链接"
else
    echo "   scripts 目录不存在"
fi
echo ""

echo "4. Google Search Console 操作建议:"
echo "   - 登录 Google Search Console"
echo "   - 使用 '删除' 工具删除不需要的外部链接"
echo "   - 重新提交 sitemap.xml"
echo "   - 监控索引状态变化"
echo ""

echo "5. 紧急删除 URL 的步骤:"
echo "   1. 打开 Google Search Console"
echo "   2. 选择 '删除' 工具"
echo "   3. 点击 '新请求'"
echo "   4. 选择 '暂时从 Google 中删除网址'"
echo "   5. 输入要删除的 URL 模式"
echo "   6. 提交请求"
echo ""

echo "6. 验证命令:"
echo "   curl -I https://bunnymarket.app/robots.txt"
echo "   curl -s https://bunnymarket.app/sitemap.xml | head -20"
echo ""

echo "=== 报告结束 ==="