# 相关游戏推荐功能实现文档

## 概述

本文档描述了基于标签相似度的相关游戏推荐功能的实现。该功能能够根据游戏的分类标签，推荐与当前游戏最相似的其他游戏。

## 功能特点

1. **基于标签相似度**：使用Jaccard相似度算法计算游戏间的相似度
2. **排除特定标签**：自动排除"Hot Games"和"New Games"标签，专注于游戏类型相似性
3. **性能优化**：使用缓存机制和Edge Runtime提升性能
4. **容错处理**：当游戏没有分类时，回退到评分最高的游戏
5. **响应式设计**：支持加载状态、错误处理和空状态

## 技术实现

### 1. API端点

**文件**: `app/api/getRelatedGames/route.ts`

- 使用Edge Runtime提升性能
- 支持缓存策略（5分钟缓存，10分钟stale）
- 性能监控和错误处理
- 支持HEAD请求用于健康检查

### 2. 数据模型

**文件**: `models/games.ts` - `getRelatedGames`函数

#### 算法流程：

1. **获取当前游戏分类**：
   ```sql
   SELECT DISTINCT c.id as category_id, c.name as category_name
   FROM project_games pg
   INNER JOIN project_game_categories pgc ON pg.id = pgc.project_game_id
   INNER JOIN project_categories pc ON pgc.project_category_id = pc.id
   INNER JOIN categories c ON pc.category_id = c.id
   WHERE pg.project_id = ? 
     AND pg.locale = ?
     AND pg.game_id = ?
     AND pg.is_published = 1
     AND c.name NOT IN ('Hot Games', 'New Games')
   ```

2. **获取所有其他游戏及其分类**：
   ```sql
   SELECT 
     pg.game_id as gameId,
     -- ... 其他字段
     GROUP_CONCAT(c.name) as categories,
     GROUP_CONCAT(c.id) as category_ids
   FROM project_games pg
   -- ... JOIN语句
   WHERE pg.project_id = ? 
     AND pg.locale = ?
     AND pg.game_id != ?
     AND pg.is_published = 1
   GROUP BY pg.id, gr.average_rating, gr.total_ratings
   ```

3. **计算Jaccard相似度**：
   ```javascript
   const intersection = gameCategoryIds.filter(id => 
     currentCategoryIds.includes(id)
   ).length;
   const union = new Set([...currentCategoryIds, ...gameCategoryIds]).size;
   const similarity = union > 0 ? intersection / union : 0;
   ```

4. **排序和限制**：
   - 按相似度降序排序
   - 相似度相近时按评分排序
   - 限制返回数量

### 3. 前端组件

**文件**: `components/related-games.tsx`

#### 特性：

- **客户端组件**：使用"use client"指令
- **状态管理**：使用React hooks管理加载、错误和数据状态
- **响应式UI**：支持加载状态、错误处理和空状态
- **性能优化**：只在currentGameId变化时重新获取数据

#### 状态处理：

```javascript
const [relatedGames, setRelatedGames] = useState<GameProps[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

## 使用示例

### API调用

```bash
# 获取bunny-market的相关游戏
curl -X GET "http://localhost:3000/api/getRelatedGames?gameId=bunny-market&limit=16"
```

### 组件使用

```jsx
import { RelatedGames } from "@/components/related-games"

// 在游戏详情页中使用
<RelatedGames currentGameId={game.id} />
```

## 测试

### 测试页面

**文件**: `app/test-related/page.tsx`

提供了测试页面来验证不同游戏的相关推荐功能。

### 测试用例

1. **bunny-market** (分类: Animal Games, New Games, Strategy Games)
   - 推荐: bunny-market-unblocked (共享Animal Games, New Games)
   - 推荐: bunny-farm (共享New Games, Strategy Games)

2. **bunny-market-unblocked** (分类: Animal Games, New Games)
   - 推荐: bunny-market (共享Animal Games, New Games)
   - 推荐: bunny-farm (共享New Games)

## 性能优化

1. **缓存策略**：
   - API响应缓存：5分钟
   - 数据库查询缓存：基于游戏ID和参数
   - 浏览器缓存：stale-while-revalidate

2. **数据库优化**：
   - 使用索引优化JOIN查询
   - 限制查询结果数量
   - 避免N+1查询问题

3. **前端优化**：
   - 客户端状态管理
   - 条件渲染
   - 错误边界处理

## 扩展性

该实现具有良好的扩展性：

1. **算法扩展**：可以轻松添加其他相似度算法（如余弦相似度、欧几里得距离等）
2. **权重系统**：可以为不同分类添加权重
3. **用户行为**：可以结合用户点击、评分等行为数据
4. **机器学习**：可以集成ML模型进行更精准的推荐

## 注意事项

1. **数据库依赖**：需要正确的分类数据才能正常工作
2. **性能考虑**：大量游戏时需要考虑查询性能
3. **缓存一致性**：游戏分类更新时需要清除相关缓存
4. **错误处理**：需要妥善处理网络错误和数据库错误

## 未来改进

1. **实时推荐**：基于用户实时行为调整推荐
2. **个性化**：结合用户偏好和历史数据
3. **A/B测试**：支持不同推荐算法的测试
4. **分析统计**：添加推荐效果分析功能
