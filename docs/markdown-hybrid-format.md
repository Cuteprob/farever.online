# Markdown 混合格式实现文档

## 概述

本项目实现了 JSON + Markdown 混合格式的游戏数据展示系统，允许在 JSON 数据文件中存储 Markdown 格式的游戏内容，并通过 React 组件进行渲染。

## 架构设计

### 数据格式

```typescript
interface TestGame {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  category: string;
  content: {
    overview: string;      // Markdown 格式的游戏概述
    howToPlay: string;     // Markdown 格式的游戏玩法
    features: string;      // Markdown 格式的游戏特色
    screenshots: string;   // Markdown 格式的截图展示
  };
  metadata: {
    releaseDate: string;
    developer: string;
    platform: string[];
  };
}
```

### 文件结构

```
├── types/test-game.ts              # 类型定义
├── data/test-games.json            # 测试数据
├── utils/markdown.ts               # Markdown 工具函数
├── styles/markdown.css             # Markdown 样式
├── components/test/
│   ├── MarkdownRenderer.tsx        # 通用渲染组件
│   ├── TestGameCard.tsx            # 游戏卡片组件
│   ├── TestGameDetail.tsx          # 游戏详情组件
│   ├── TestGameList.tsx            # 游戏列表组件
│   └── ErrorBoundary.tsx           # 错误边界组件
└── app/test/                       # 测试页面
    ├── page.tsx                    # 测试导航页
    ├── test-games/page.tsx         # 游戏列表页
    └── test-game/[id]/page.tsx     # 游戏详情页
```

## 核心功能

### 1. Markdown 渲染

- 使用 `react-markdown` 库进行渲染
- 支持语法高亮（`react-syntax-highlighter`）
- 自定义组件（图片、链接、代码块等）
- 响应式样式设计

### 2. 内容管理

- 结构化内容存储（overview, howToPlay, features, screenshots）
- 内容预览和截断功能
- 标签页切换显示不同内容

### 3. 性能优化

- 组件缓存（React.memo）
- 图片懒加载
- 错误边界处理
- 内容分片渲染

## 使用方法

### 1. 创建游戏数据

```json
{
  "id": "game-1",
  "title": "游戏标题",
  "description": "游戏描述",
  "image": "游戏图片URL",
  "rating": 4.8,
  "category": "puzzle",
  "content": {
    "overview": "# 游戏概述\n\n这是游戏的概述内容...",
    "howToPlay": "## 游戏玩法\n\n1. 第一步\n2. 第二步",
    "features": "## 游戏特色\n\n- 特色1\n- 特色2",
    "screenshots": "## 游戏截图\n\n![截图](/image.jpg)"
  },
  "metadata": {
    "releaseDate": "2024-01-01",
    "developer": "开发商",
    "platform": ["Web", "iOS", "Android"]
  }
}
```

### 2. 使用组件

```tsx
// 游戏列表
<TestGameList games={games} title="游戏列表" description="描述" />

// 游戏卡片
<TestGameCard game={game} showFullContent={false} />

// 游戏详情
<TestGameDetail game={game} />

// Markdown 渲染
<MarkdownRenderer content={markdownContent} />
```

### 3. 自定义样式

```css
/* 在 styles/markdown.css 中自定义样式 */
.markdown-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
}
```

## 测试页面

访问以下页面进行测试：

- `/test` - 测试导航页
- `/test/test-games` - 游戏列表测试
- `/test/test-game/[id]` - 游戏详情测试

## 优势

### 1. 灵活性
- 内容与样式分离
- 支持丰富的 Markdown 格式
- 易于编辑和维护

### 2. 兼容性
- JSON 格式完全兼容 edge runtime
- 无需额外的构建步骤
- 支持静态生成

### 3. 性能
- 客户端渲染，无服务端依赖
- 组件缓存和懒加载
- 优化的渲染性能

### 4. 可扩展性
- 模块化组件设计
- 易于添加新的内容类型
- 支持自定义渲染组件

## 注意事项

### 1. 安全性
- Markdown 内容需要验证和清理
- 避免 XSS 攻击
- 限制可用的 HTML 标签

### 2. 性能考虑
- 大量 Markdown 内容可能影响性能
- 建议使用内容截断和懒加载
- 考虑服务端预渲染

### 3. 样式一致性
- 确保 Markdown 样式与设计系统一致
- 测试不同设备和浏览器
- 支持深色模式

## 未来改进

1. **服务端渲染**：支持服务端 Markdown 预渲染
2. **内容编辑器**：集成 Markdown 编辑器
3. **版本控制**：内容版本管理和回滚
4. **国际化**：多语言内容支持
5. **SEO 优化**：结构化数据标记

## 技术栈

- **React 18** - 前端框架
- **Next.js 14** - 全栈框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式系统
- **react-markdown** - Markdown 渲染
- **react-syntax-highlighter** - 代码高亮
- **Lucide React** - 图标库
