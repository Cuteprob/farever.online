# 自动生成 Sitemap 功能实现文档

## 概述

已成功为 BunnyMarket 网站实现了自动生成 sitemap 的功能，使用 Next.js 13+ App Router 的内置 sitemap 功能。

## 实现详情

### 1. 文件结构
- **新增**: `app/sitemap.ts` - 动态 sitemap 生成器
- **删除**: `public/sitemap.xml` - 旧的静态 sitemap 文件

### 2. 功能特性

#### 动态内容生成
- **游戏页面**: 自动从数据库获取所有已发布的游戏并生成对应的 URL
- **分类页面**: 自动获取所有有游戏的分类并生成分类页面 URL  
- **静态页面**: 包含主页、隐私政策、服务条款等固定页面

#### SEO 优化配置
- **优先级设置**:
  - 主页: `1.0` (最高优先级)
  - 游戏页面: `0.9` (很高优先级) 
  - 分类页面: `0.8` (高优先级)
  - 静态页面: `0.5` (中等优先级)

- **更新频率**:
  - 主页: `daily` (每日更新)
  - 游戏页面: `weekly` (每周更新)
  - 分类页面: `daily` (每日更新)
  - 静态页面: `monthly` (每月更新)

#### 性能优化
- 使用 Edge Runtime 提高响应速度
- 包含错误处理机制，确保在数据库查询失败时返回基本页面
- 生成过程中的性能监控和日志记录

### 3. URL 生成规则

```
https://bunnymarket.app/                    # 主页
https://bunnymarket.app/privacy             # 隐私政策  
https://bunnymarket.app/terms               # 服务条款
https://bunnymarket.app/{game-id}           # 游戏详情页
https://bunnymarket.app/games/{category}    # 分类页面
```

### 4. 技术实现

#### 核心代码
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllGames, getAllCategories } from '@/models/games';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 获取所有游戏和分类数据
  // 生成对应的 URL 结构
  // 返回符合 sitemap 格式的数据
}
```

#### 数据源
- **游戏数据**: 通过 `getAllGames({})` 获取所有已发布游戏
- **分类数据**: 通过 `getAllCategories()` 获取所有有游戏的分类
- **静态页面**: 预定义的页面列表

### 5. 访问方式

sitemap 会自动在以下 URL 生成：
- **开发环境**: `http://localhost:3000/sitemap.xml`
- **生产环境**: `https://bunnymarket.app/sitemap.xml`

### 6. 测试结果

功能测试显示 sitemap 正常工作：
- ✅ 包含 18 个 URL（3个静态页面 + 11个游戏页面 + 4个分类页面）
- ✅ XML 格式正确且符合 sitemap 标准
- ✅ 所有 URL 包含正确的 lastmod、changefreq 和 priority 字段
- ✅ 构建过程无错误
- ✅ 动态生成功能正常，每次访问都从数据库获取最新数据
- ✅ 包含 revalidate 配置确保生产环境动态更新
- ✅ 修复静态页面 lastmod 时间戳显示问题（原显示 1970-01-01）

### 7. 自动更新机制

- **实时更新**: 每次访问 sitemap.xml 时会从数据库获取最新数据
- **新游戏**: 当数据库中添加新游戏时，会自动出现在 sitemap 中
- **新分类**: 当添加新的游戏分类时，会自动生成对应的分类页面 URL
- **智能缓存**: 使用 ISR (Incremental Static Regeneration) 5分钟重新验证策略
- **无需重构建**: 完全动态生成，添加新游戏后无需重新部署项目

### 8. 部署注意事项

由于项目部署在 Cloudflare Pages 上：
- sitemap 生成器使用了 Edge Runtime，完全兼容 Cloudflare 环境
- 自动更新功能在生产环境中正常工作
- 不需要额外的配置或构建步骤

### 9. SEO 优势

- **搜索引擎发现**: 帮助搜索引擎更好地发现和索引网站内容
- **实时更新**: 新内容可以被搜索引擎及时发现
- **优先级指导**: 帮助搜索引擎理解页面的重要性
- **标准格式**: 符合 XML Sitemap 协议标准

## 维护说明

此 sitemap 功能是完全自动化的，无需手动维护。当网站添加新游戏或分类时，sitemap 会自动更新以包含新的 URL。

