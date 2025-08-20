# 游戏详情页数据获取流程优化

## 优化概述

参考主页面 `app/page.tsx` 的数据获取流程，成功实现了游戏详情页 `app/[id]/page.tsx` 的数据库数据获取功能，取代了原有的静态数据方式，提升了数据一致性和性能。

## 实现的优化

### 1. 数据获取流程统一

#### 主页面流程模式
```typescript
// app/page.tsx
async function getMainGameData(): Promise<GameProps | null> {
  try {
    const startTime = Date.now();
    const game = await getMainGame();
    const endTime = Date.now();
    
    // 性能监控 (仅在开发环境)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Main game loaded in ${endTime - startTime}ms`);
    }
    
    return game;
  } catch (error) {
    console.error('Failed to load main game:', error);
    return null; // 保证页面能正常渲染
  }
}
```

#### 游戏详情页实现
```typescript
// app/[id]/page.tsx
async function getGameDetailData(gameId: string): Promise<GameProps | null> {
  try {
    const startTime = Date.now();
    const game = await getGameById(gameId);
    const endTime = Date.now();
    
    // 性能监控 (仅在开发环境)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Game detail loaded in ${endTime - startTime}ms for gameId: ${gameId}`);
    }
    
    return game;
  } catch (error) {
    console.error(`Failed to load game detail for gameId: ${gameId}`, error);
    return null; // 保证页面能正常渲染
  }
}
```

### 2. 数据库函数优化

#### `getGameById` 函数性能优化

**优化前**：
- 使用缓存，但可能导致评分数据过期
- 缓存逻辑复杂

**优化后**：
```typescript
export async function getGameById(gameId: string): Promise<GameProps | null> {
  const { projectId, locale } = getProjectConfig();
  const cacheKey = getCacheKey('getGameById', { gameId, projectId, locale });
  
  // 不使用缓存以避免评分数据过期（游戏详情页需要显示实时评分）

  const query = `
    SELECT 
      pg.game_id as gameId,
      pg.title,
      pg.content,
      pg.metadata,
      gb.iframe_url as iframeUrl,
      gb.image_url as imageUrl,
      gb.created_at as createdAt,
      COALESCE(gr.average_rating, 0) as averageRating,
      COALESCE(gr.total_ratings, 0) as totalRatings,
      GROUP_CONCAT(c.name) as categories
    FROM project_games pg
    INNER JOIN games_base gb ON pg.game_id = gb.id
    LEFT JOIN game_ratings gr ON pg.game_id = gr.game_id 
      AND pg.project_id = gr.project_id 
      AND pg.locale = gr.locale
    LEFT JOIN project_game_categories pgc ON pg.id = pgc.project_game_id
    LEFT JOIN project_categories pc ON pgc.project_category_id = pc.id
    LEFT JOIN categories c ON pc.category_id = c.id
    WHERE pg.project_id = ? 
      AND pg.locale = ?
      AND pg.game_id = ?
      AND pg.is_published = 1
    GROUP BY pg.id, gr.average_rating, gr.total_ratings
    LIMIT 1
  `;
  
  // ... 错误处理和返回逻辑
}
```

### 3. 性能优化策略

#### 实时数据保证
- **主页面**：`getMainGame()` 不使用缓存，确保实时评分数据
- **游戏详情页**：`getGameById()` 不使用缓存，确保实时评分数据
- 保持数据一致性，用户看到的评分都是最新的

#### 性能监控
- 开发环境下记录数据加载耗时
- 便于性能调试和优化
- 生产环境不产生额外开销

#### 错误处理
- 统一的错误处理策略
- 返回 `null` 而不是抛出错误
- 保证页面在数据加载失败时能正常渲染

### 4. 数据流程对比

#### 优化前（游戏详情页）
```typescript
// 使用静态数据
const testGames: GameProps[] = testGamesData as GameProps[];
const game = testGames.find(g => g.id === params.id);
```

**问题**：
- 依赖静态数据，不能反映数据库的实时变化
- `testGamesData` 变量未定义，导致编译错误
- 无法获取实时评分和评论数据

#### 优化后（游戏详情页）
```typescript
// 使用数据库数据
const game = await getGameDetailData(params.id);
```

**优势**：
- 实时获取数据库中的游戏数据
- 包含最新的评分和评论统计
- 与主页面数据流程保持一致

### 5. 缓存策略优化

#### 原则
- **主页面和游戏详情页**：不使用缓存，确保评分数据实时性
- **评论和其他数据**：使用缓存，提升性能
- **缓存失效**：评论提交和评分更新时自动清除相关缓存

#### 实现
```typescript
// 在 submitGameComment 中的缓存清理
if (commentData.gameId) {
  clearCache(`getGameComments:${commentData.gameId}`);
  cacheManager.invalidateByDependency(`game:${commentData.gameId}`);
  if (commentData.ratingScore) {
    await clearAllGameCaches(commentData.gameId);
  }
}
```

## 技术优势

### 1. 数据一致性
- 主页面和游戏详情页都从数据库获取实时数据
- 评分和评论数据保持同步
- 避免静态数据与数据库数据不一致的问题

### 2. 性能优化
- 针对 Cloudflare Pages 优化
- 合理的缓存策略
- 开发环境性能监控

### 3. 错误处理
- 统一的错误处理机制
- 优雅降级，保证用户体验
- 详细的错误日志记录

### 4. 维护性
- 代码结构一致
- 减少冗余代码
- 便于后续维护和扩展

## 部署验证

### 功能验证
✅ 游戏详情页可以正确获取数据库中的游戏数据  
✅ 实时评分和评论统计正确显示  
✅ 404 页面在游戏不存在时正确显示  
✅ 性能监控正常工作  
✅ 错误处理机制正常  

### 性能验证
- 数据加载时间在可接受范围内
- 不会因为数据库查询阻塞页面渲染
- 错误情况下页面仍能正常显示

## 使用方式

用户访问游戏详情页时，系统会：

1. 根据 URL 中的 `gameId` 参数调用 `getGameDetailData()`
2. 函数内部调用 `getGameById()` 从数据库获取游戏数据
3. 返回包含实时评分和分类信息的完整游戏数据
4. 如果游戏不存在，显示 404 页面
5. 如果数据库查询失败，也显示 404 页面，保证用户体验

## 总结

通过这次优化，游戏详情页的数据获取流程与主页面保持一致，实现了：

- ✅ **数据一致性**：统一使用数据库数据源
- ✅ **性能优化**：针对 Cloudflare Pages 的优化策略
- ✅ **实时性**：展示最新的评分和评论数据
- ✅ **可维护性**：统一的代码结构和错误处理
- ✅ **用户体验**：优雅的错误处理和加载体验

项目现在具有更好的数据一致性和用户体验，为后续功能扩展奠定了坚实基础。
