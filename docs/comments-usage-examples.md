# 评论系统使用指南

## 概述

基于 Turso 数据库的评论系统现已完全集成到项目中，支持实时评论、评分和统计信息。

## 🚀 **主要功能**

### ✅ **已实现功能**
- **实时评论数据**：从 Turso 数据库获取评论
- **项目上下文集成**：支持 projectId、locale、gameId 上下文
- **评分系统**：1-5星评分功能
- **审核系统**：评论状态管理（pending/approved/rejected）
- **统计信息**：评论数量、平均评分、待审核数量
- **性能优化**：缓存策略和 Edge Runtime
- **响应式UI**：适配桌面和移动端

## 📋 **API 端点**

### GET `/api/comments`
获取评论列表

**查询参数：**
```typescript
{
  gameId?: string,        // 特定游戏的评论（可选）
  limit?: number,         // 返回数量限制（默认20）
  offset?: number,        // 分页偏移（默认0）
  includeStats?: boolean  // 是否包含统计信息（默认false）
}
```

**响应格式：**
```typescript
{
  success: boolean,
  data: GameComment[],
  count: number,
  stats?: {
    total: number,
    approved: number,
    pending: number,
    averageRating?: number
  },
  meta: {
    gameId?: string,
    limit: number,
    offset: number,
    hasMore: boolean
  }
}
```

### POST `/api/comments`
提交新评论

**请求体：**
```typescript
{
  content: string,        // 评论内容（必填）
  nickname: string,       // 用户昵称（必填）
  email?: string,         // 邮箱（可选）
  gameId?: string,        // 游戏ID（可选）
  ratingScore?: number    // 评分1-5（可选）
}
```

## 🎯 **组件使用方法**

### 基础用法
```tsx
import { Comments } from '@/components/comments';

// 通用评论区（所有项目评论）
<Comments pageTitle="Community Discussions" />

// 特定游戏评论区
<Comments 
  pageTitle="Bunny Market Game" 
  gameId="bunny-market-adventure"
  className="mt-8"
/>
```

### 游戏详情页集成
```tsx
// app/[id]/page.tsx
import { Comments } from '@/components/comments';

export default function GamePage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* 游戏内容 */}
      <div className="game-content">
        {/* ... */}
      </div>
      
      {/* 评论区 */}
      <Comments 
        pageTitle={game.title}
        gameId={params.id}
        className="mt-12"
      />
    </div>
  );
}
```

## 🗄️ **数据库模型**

### 评论表结构（gameComments）
```sql
CREATE TABLE game_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,              -- 评论内容
  nickname TEXT NOT NULL,             -- 用户昵称
  email TEXT,                         -- 邮箱(可选)
  game_id TEXT,                       -- 游戏ID(可选)
  project_id TEXT NOT NULL,           -- 项目ID
  locale TEXT NOT NULL,               -- 语言环境
  rating_score INTEGER,               -- 用户评分(1-5)
  status TEXT NOT NULL DEFAULT 'pending', -- 审核状态
  helpful_votes INTEGER DEFAULT 0,    -- 有用投票数
  created_at TEXT NOT NULL,           -- 创建时间
  updated_at TEXT,                    -- 更新时间
  moderated_at TEXT                   -- 审核时间
);
```

## ⚡ **性能特性**

### 缓存策略
- **API层**：1分钟短期缓存保持时效性
- **数据层**：5分钟内存缓存，依赖关系管理
- **统计数据**：10分钟长期缓存
- **Edge Runtime**：全球CDN分发

### 查询优化
- 索引优化：`game_id + project_id`，`status`，`created_at`
- 分页支持：防止大量数据影响性能
- 条件查询：支持按游戏、状态筛选

## 🔧 **配置项**

### 环境变量
```env
# 数据库配置
TURSO_DATABASE_URL=your_turso_database_url
TURSO_DATABASE_AUTH_TOKEN=your_turso_auth_token

# 项目配置
PROJECT_ID=bunnymarket-app  # 项目标识符
```

### 项目配置
```typescript
// models/games.ts
function getProjectConfig() {
  return {
    projectId: process.env.PROJECT_ID || 'bunnymarket-app',
    locale: 'en' // 默认英语
  };
}
```

## 🛠️ **扩展功能**

### 1. 添加评论点赞功能
```typescript
// 在 models/games.ts 中添加
export async function voteComment(commentId: string, helpful: boolean) {
  // 实现点赞逻辑
}
```

### 2. 管理员审核界面
```typescript
// 创建管理后台用于评论审核
export async function moderateComment(
  commentId: string, 
  status: 'approved' | 'rejected'
) {
  // 实现审核逻辑
}
```

### 3. 多语言支持
```typescript
// 支持不同语言的评论显示
<Comments 
  pageTitle="游戏评论"
  gameId="bunny-market"
  locale="zh-CN"
/>
```

## 📊 **监控和分析**

### 性能监控
- API响应时间记录
- 缓存命中率统计
- 数据库查询性能

### 使用分析
- 评论提交频率
- 用户参与度统计
- 评分分布分析

---

## 🚀 **迁移说明**

现有的Comments组件已完全兼容新的数据库系统：

1. **自动切换**：组件会自动从模拟数据切换到真实数据库
2. **向后兼容**：现有的使用方式保持不变
3. **增强功能**：新增评分、统计、上下文支持

只需要确保：
- Turso数据库连接正常
- 相关表结构已创建
- 环境变量配置正确

系统将无缝运行！🎉
