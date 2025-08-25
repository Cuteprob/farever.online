# Google 索引控制策略

## 问题描述
Google 除了收录 sitemap.ts 中设置的页面外，还收录了游戏中 iframe 的外部链接。

## 解决方案

### 1. robots.txt 配置（已完成）
已在 `/public/robots.txt` 中添加以下规则：
```
# 禁止抓取外部游戏iframe链接
Disallow: /iframe/
Disallow: /*iframe*

# 禁止抓取常见的外部游戏域名模式
Disallow: /external/
Disallow: /*sprunki.com*
Disallow: /*game-embed*
Disallow: /*embed*

# 禁止抓取API接口
Disallow: /api/
```

### 2. iframe 安全配置（已完成）
为 iframe 标签添加了以下属性：
- `sandbox`: 限制 iframe 内容的权限
- `referrerPolicy="no-referrer"`: 阻止传递引用信息
- `loading="lazy"`: 延迟加载

### 3. Next.js 安全头配置（已完成）
在 `next.config.mjs` 中添加了安全头：
- `X-Frame-Options`: 防止被嵌入到其他网站
- `X-Content-Type-Options`: 防止 MIME 类型嗅探
- `Referrer-Policy`: 控制引用信息传递
- `X-Robots-Tag`: 控制搜索引擎行为

### 4. Google Search Console 操作步骤

#### 4.1 删除已收录的外部链接
1. 登录 Google Search Console
2. 选择 "删除" 工具 (Removals)
3. 点击 "新请求" (New Request)
4. 选择 "暂时从 Google 中删除网址" (Temporarily remove URL from Google)
5. 输入要删除的外部链接模式，例如：
   - `https://sprunki.com/game/*`
   - 或者具体的 iframe 链接

#### 4.2 设置 URL 参数处理
1. 在 Search Console 中设置 URL 参数
2. 告诉 Google 忽略包含 iframe 参数的 URL

#### 4.3 提交更新的 sitemap
1. 确保 sitemap.xml 只包含您希望被收录的页面
2. 在 Search Console 中重新提交 sitemap

### 5. 监控和验证

#### 5.1 检查命令
使用以下搜索命令在 Google 中检查：
```
site:bunnymarket.app inurl:sprunki.com
site:bunnymarket.app inurl:iframe
```

#### 5.2 定期检查
- 每周检查一次 Google 收录情况
- 监控 Search Console 中的索引状态
- 确认外部链接是否被移除

### 6. 预防措施

#### 6.1 代码层面
- 所有外部游戏链接使用 `rel="nofollow noopener"` 属性
- iframe 使用 sandbox 限制
- 实施内容安全策略 (CSP)

#### 6.2 服务器层面
- 配置正确的 robots.txt
- 设置适当的 HTTP 头
- 实施速率限制

### 7. 紧急情况处理
如果发现新的外部链接被收录：
1. 立即在 robots.txt 中添加 Disallow 规则
2. 在 Google Search Console 中提交删除请求
3. 更新代码以防止未来类似问题

### 8. 效果评估
- 通常需要 1-2 周时间才能看到效果
- Google 需要重新抓取网站才能应用新的 robots.txt 规则
- 删除请求通常在 24-48 小时内生效