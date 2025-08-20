import { turso } from "@/models/tursoDb";
import { GameProps, GameComment, DbGameResult, GameQueryParams } from "@/types/game";
import { cacheManager } from "@/utils/cache-manager";
import { transformDbResultToGame } from "@/lib/format";

// 缓存辅助函数
function getCacheKey(operation: string, params: any): string {
  return `${operation}:${JSON.stringify(params)}`;
}

function getFromCache<T>(key: string): T | null {
  return cacheManager.get<T>(key);
}

function setCache<T>(key: string, data: T, dependencies?: string[]): void {
  cacheManager.set(key, data, dependencies);
}

// 根据数据类型设置缓存的辅助函数
function setCacheWithType<T>(key: string, data: T, type: 'games' | 'mainGame' | 'gameDetail' | 'categories' | 'ratings' | 'comments' | 'search' | 'performance', dependencies?: string[]): void {
  cacheManager.setWithType(key, data, type, dependencies);
}

// 手动缓存清除功能
export const clearGameCache = {
  // 清除所有游戏相关缓存
  all: () => cacheManager.clear(),
  
  // 清除特定游戏的缓存
  game: (gameId: string) => cacheManager.invalidateByDependency(`game:${gameId}`),
  
  // 清除主游戏缓存
  mainGame: () => cacheManager.invalidate('getMainGame'),
  
  // 清除分类相关缓存
  categories: () => cacheManager.invalidateByDependency('categories'),
  
  // 清除评论相关缓存
  comments: (gameId?: string) => {
    if (gameId) {
      cacheManager.invalidateByDependency(`game:${gameId}`);
    } else {
      cacheManager.invalidateByDependency('comments');
    }
  },
  
  // 清除相关游戏缓存
  related: (gameId: string) => cacheManager.invalidateByDependency(`game:${gameId}`),
  
  // 清除搜索缓存
  search: () => cacheManager.invalidate('search'),
}

// 获取项目ID和语言配置
function getProjectConfig() {
  return {
    projectId: process.env.PROJECT_ID || 'bunnymarket-app',
    locale: 'en' // 默认英语
  };
}

// 获取主页面游戏 (isMain=1) - 只返回一个游戏
export async function getMainGame(): Promise<GameProps | null> {
  const { projectId, locale } = getProjectConfig();
  const cacheKey = getCacheKey('getMainGame', { projectId, locale });
  
  // 检查缓存（使用30分钟TTL）
  const cached = getFromCache<GameProps>(cacheKey);
  if (cached) {
    console.log('models/games.ts getMainGame cached');
    return cached;
  }

  const query = `
    SELECT 
      pg.game_id as gameId,
      pg.title,
      pg.content,
      pg.metadata,
      gb.metadata as baseMetadata,
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
      AND pg.is_main = 1
      AND pg.is_published = 1
    GROUP BY pg.id, gr.average_rating, gr.total_ratings
    ORDER BY gr.average_rating DESC, gb.created_at DESC
    LIMIT 1
  `;

  try {
    const result = await turso.execute({
      sql: query,
      args: [projectId, locale]
    });

    if (result.rows.length === 0) {
      setCacheWithType(cacheKey, null, 'mainGame');
      return null;
    }
    const game = transformDbResultToGame(result.rows[0]);
    
    // 设置主游戏缓存（30分钟）
    setCacheWithType(cacheKey, game, 'mainGame');
    
    return game;
  } catch (error) {
    console.error('Error fetching main game:', error);
    return null;
  }
}

// 获取游戏评论 - 性能优化版本
export async function getGameComments(
  gameId?: string,
  limit: number = 20,
  offset: number = 0
): Promise<GameComment[]> {
  const { projectId, locale } = getProjectConfig();
  const cacheKey = getCacheKey('getGameComments', { gameId, projectId, locale, limit, offset });
  
  // 检查缓存 - 短期缓存以保持评论时效性（15分钟）
  const cached = getFromCache<GameComment[]>(cacheKey);
  if (cached) {
    return cached;
  }
  
  let query = `
    SELECT 
      id,
      content,
      nickname,
      email,
      game_id as gameId,
      rating_score as ratingScore,
      helpful_votes as helpfulVotes,
      created_at as createdAt,
      status
    FROM game_comments
    WHERE project_id = ?
      AND locale = ?
      AND status = 'approved'
  `;

  const queryArgs: any[] = [projectId, locale];

  // 如果指定了gameId，添加游戏过滤
  if (gameId) {
    query += ` AND game_id = ?`;
    queryArgs.push(gameId);
  }

  query += `
    ORDER BY helpful_votes DESC, created_at DESC
    LIMIT ? OFFSET ?
  `;
  queryArgs.push(limit, offset);

  try {
    const result = await turso.execute({
      sql: query,
      args: queryArgs
    });

    const comments = result.rows.map(row => ({
      id: String(row.id),
      content: row.content as string,
      nickname: row.nickname as string,
      email: row.email as string | undefined,
      gameId: row.gameId as string,
      ratingScore: row.ratingScore as number | undefined,
      helpfulVotes: (row.helpfulVotes as number) || 0,
      createdAt: row.createdAt as string,
      status: row.status as 'pending' | 'approved' | 'rejected'
    }));

    // 短期缓存结果（15分钟），设置依赖关系
    setCacheWithType(cacheKey, comments, 'comments', [`game:${gameId}`, 'comments']);
    
    return comments;
  } catch (error) {
    console.error('Error fetching game comments:', error);
    return [];
  }
}

// 提交游戏评论 - 新增函数
export async function submitGameComment(commentData: {
  content: string;
  nickname: string;
  email?: string;
  gameId?: string;
  ratingScore?: number;
}): Promise<{
  success: boolean;
  data?: { id: number };
  error?: string;
}> {
  const { projectId, locale } = getProjectConfig();
  
  // 验证输入
  if (!commentData.content?.trim() || !commentData.nickname?.trim()) {
    return { success: false, error: 'Content and nickname are required' };
  }

  if (commentData.ratingScore && (commentData.ratingScore < 1 || commentData.ratingScore > 5)) {
    return { success: false, error: 'Rating must be between 1 and 5' };
  }

  try {
    // 插入评论
    const result = await turso.execute({
      sql: `
        INSERT INTO game_comments (
          content, nickname, email, game_id, project_id, locale, 
          rating_score, status, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      args: [
        commentData.content.trim(),
        commentData.nickname.trim(),
        commentData.email?.trim() || null,
        commentData.gameId || null,
        projectId,
        locale,
        commentData.ratingScore || null
      ]
    });

    // 如果评论包含评分且有游戏ID，同时更新游戏评分表
    if (commentData.ratingScore && commentData.gameId) {
      try {
        await syncRatingToGameRatings(commentData.gameId, commentData.ratingScore);
        console.log(`Successfully synced rating ${commentData.ratingScore} for game ${commentData.gameId}`);
      } catch (ratingError) {
        console.error('Error syncing rating to game_ratings table:', ratingError);
        // 评分同步失败不影响评论提交的成功，但记录错误
      }
    }

    // 清除相关缓存
    if (commentData.gameId) {
      clearCache(`getGameComments:${commentData.gameId}`);
      cacheManager.invalidateByDependency(`game:${commentData.gameId}`);
      // 如果有评分，也清除评分相关缓存
      if (commentData.ratingScore) {
        await clearAllGameCaches(commentData.gameId);
      }
    }
    cacheManager.invalidateByDependency('comments');

    return { 
      success: true, 
      data: { id: Number(result.lastInsertRowid) }
    };

  } catch (error) {
    console.error('Error submitting comment:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Database error' 
    };
  }
}

// 获取评论统计信息
export async function getCommentStats(gameId?: string): Promise<{
  total: number;
  approved: number;
  pending: number;
  averageRating?: number;
}> {
  const { projectId, locale } = getProjectConfig();
  const cacheKey = getCacheKey('getCommentStats', { gameId, projectId, locale });
  
  // 检查缓存
  const cached = getFromCache<any>(cacheKey);
  if (cached) {
    return cached;
  }

  let query = `
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
      AVG(CASE WHEN status = 'approved' AND rating_score IS NOT NULL THEN rating_score END) as averageRating
    FROM game_comments
    WHERE project_id = ? AND locale = ?
  `;

  const queryArgs: any[] = [projectId, locale];

  if (gameId) {
    query += ` AND game_id = ?`;
    queryArgs.push(gameId);
  }

  try {
    const result = await turso.execute({
      sql: query,
      args: queryArgs
    });

    const row = result.rows[0];
    const stats = {
      total: Number(row.total) || 0,
      approved: Number(row.approved) || 0,
      pending: Number(row.pending) || 0,
      averageRating: row.averageRating ? Math.round((row.averageRating as number) * 10) / 10 : undefined
    };

    // 缓存统计数据（15分钟）
    setCacheWithType(cacheKey, stats, 'comments', [`game:${gameId}`, 'comments']);
    
    return stats;
  } catch (error) {
    console.error('Error fetching comment stats:', error);
    return { total: 0, approved: 0, pending: 0 };
  }
}

// 获取所有游戏（兼容现有API）- 性能优化版本
export async function getAllGames(
  params: GameQueryParams = {}
): Promise<GameProps[]> {
  const { projectId, locale } = getProjectConfig();
  const { limit, offset = 0, categoryId, isMain } = params;
  
  const cacheKey = getCacheKey('getAllGames', { 
    projectId, 
    locale, 
    limit, 
    offset, 
    categoryId, 
    isMain 
  });
  
  // 不使用缓存以避免评分数据过期（首页/列表需要展示实时评分）
  
  let query = `
    SELECT 
      pg.game_id as gameId,
      pg.title,
      pg.content,
      pg.metadata,
      gb.metadata as baseMetadata,
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
      AND pg.is_published = 1
  `;

  const queryArgs: any[] = [projectId, locale];

  // 添加条件过滤
  if (isMain !== undefined) {
    query += ` AND pg.is_main = ?`;
    queryArgs.push(isMain ? 1 : 0);
  }

  if (categoryId) {
    query += ` AND c.id = ?`;
    queryArgs.push(categoryId);
  }

  query += `
    GROUP BY pg.id, gr.average_rating, gr.total_ratings
    ORDER BY gr.average_rating DESC, gb.created_at DESC
  `;

  if (limit) {
    query += ` LIMIT ?`;
    queryArgs.push(limit);
  }

  if (offset > 0) {
    query += ` OFFSET ?`;
    queryArgs.push(offset);
  }

  try {
    const result = await turso.execute({
      sql: query,
      args: queryArgs
    });

    const games = result.rows.map(transformDbResultToGame);
    
    return games;
  } catch (error) {
    console.error('Error fetching all games:', error);
    return [];
  }
}

// 获取单个游戏详情 - 性能优化版本
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
      gb.metadata as baseMetadata,
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

  try {
    const result = await turso.execute({
      sql: query,
      args: [projectId, locale, gameId]
    });

    if (result.rows.length === 0) {
      return null;
    }

    const game = transformDbResultToGame(result.rows[0]);
    
    return game;
  } catch (error) {
    console.error('Error fetching game by ID:', error);
    return null;
  }
}

// 清除缓存函数（用于数据更新后）
export function clearCache(pattern?: string): void {
  if (pattern) {
    cacheManager.invalidate(pattern);
  } else {
    cacheManager.clear();
  }
}

// 获取所有可用分类
export async function getAllCategories(): Promise<Array<{
  id: string;
  name: string;
  description?: string;
  slug: string;
  gameCount: number;
}>> {
  const { projectId, locale } = getProjectConfig();
  const cacheKey = getCacheKey('getAllCategories', { projectId, locale });
  
  // 检查缓存
  const cached = getFromCache<Array<any>>(cacheKey);
  if (cached) {
    return cached;
  }
  
  const query = `
    SELECT 
      pc.id as project_category_id,
      COALESCE(c.id, pc.category_id) as id,
      COALESCE(pc.display_name, c.name, pc.category_id) as name,
      COALESCE(pc.description, c.description, '') as description,
      pc.sort_order,
      COALESCE(game_counts.game_count, 0) as game_count
    FROM project_categories pc
    LEFT JOIN categories c ON c.id = pc.category_id
    LEFT JOIN (
      SELECT 
        pgc.project_category_id,
        COUNT(DISTINCT pg.id) as game_count
      FROM project_game_categories pgc
      INNER JOIN project_games pg ON pgc.project_game_id = pg.id
      WHERE pg.is_published = 1 
        AND pg.project_id = ?
        AND pg.locale = ?
      GROUP BY pgc.project_category_id
    ) game_counts ON pc.id = game_counts.project_category_id
    WHERE pc.project_id = ?
      AND pc.is_active = 1
    ORDER BY pc.sort_order ASC, COALESCE(pc.display_name, c.name, pc.category_id) ASC
  `;

  try {
    const result = await turso.execute({
      sql: query,
      args: [projectId, locale, projectId]
    });

    const categories = result.rows.map(row => ({
      id: row.id as string,
      name: row.name as string,
      description: (row.description as string) || '',
      slug: (row.id as string).toLowerCase().replace(/[^a-z0-9]/g, '-'),
      gameCount: parseInt(row.game_count as string) || 0
    }));

    // 缓存结果，设置依赖关系（1小时）
    setCacheWithType(cacheKey, categories, 'categories', ['categories']);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// 根据分类slug获取分类信息
export async function getCategoryBySlug(slug: string): Promise<{
  id: string;
  name: string;
  description?: string;
  slug: string;
} | null> {
  const categories = await getAllCategories();
  return categories.find(cat => cat.slug === slug) || null;
}

// 同步评分到游戏评分表 - 内部辅助函数（用于评论提交时同步评分）
async function syncRatingToGameRatings(
  gameId: string, 
  rating: number
): Promise<void> {
  const { projectId, locale } = getProjectConfig();
  
  // 验证输入
  if (!gameId || typeof gameId !== 'string') {
    throw new Error('Invalid game ID');
  }
  
  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  // 先检查记录是否存在
  const existingResult = await turso.execute({
    sql: `
      SELECT average_rating, total_ratings,
             rating_1_count, rating_2_count, rating_3_count, rating_4_count, rating_5_count
      FROM game_ratings 
      WHERE game_id = ? AND project_id = ? AND locale = ?
    `,
    args: [gameId, projectId, locale]
  });

  if (existingResult.rows.length === 0) {
    // 插入新记录
    const ratingCounts = [0, 0, 0, 0, 0];
    ratingCounts[rating - 1] = 1;

    await turso.execute({
      sql: `
        INSERT INTO game_ratings (
          game_id, project_id, locale, average_rating, total_ratings,
          rating_1_count, rating_2_count, rating_3_count, rating_4_count, rating_5_count,
          updated_at
        )
        VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
      args: [
        gameId, projectId, locale, rating,
        ratingCounts[0], ratingCounts[1], ratingCounts[2], ratingCounts[3], ratingCounts[4]
      ]
    });
  } else {
    // 更新现有记录
    const row = existingResult.rows[0];
    const currentAverage = row.average_rating as number;
    const currentTotal = row.total_ratings as number;
    
    const newTotal = currentTotal + 1;
    const newAverage = ((currentAverage * currentTotal) + rating) / newTotal;
    
    const ratingCounts = [
      (row.rating_1_count as number) || 0,
      (row.rating_2_count as number) || 0,
      (row.rating_3_count as number) || 0,
      (row.rating_4_count as number) || 0,
      (row.rating_5_count as number) || 0
    ];
    ratingCounts[rating - 1]++;

    await turso.execute({
      sql: `
        UPDATE game_ratings 
        SET average_rating = ?, total_ratings = ?,
            rating_1_count = ?, rating_2_count = ?, rating_3_count = ?, 
            rating_4_count = ?, rating_5_count = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE game_id = ? AND project_id = ? AND locale = ?
      `,
      args: [
        newAverage, newTotal,
        ratingCounts[0], ratingCounts[1], ratingCounts[2], ratingCounts[3], ratingCounts[4],
        gameId, projectId, locale
      ]
    });
  }
}

// 保存游戏评分 - 性能优化版本
export async function saveGameRating(
  gameId: string, 
  rating: number
): Promise<{
  success: boolean;
  data?: {
    averageRating: number;
    totalRatings: number;
    ratingDistribution: Record<number, number>;
  };
  error?: string;
}> {
  const { projectId, locale } = getProjectConfig();
  
  // 验证输入
  if (!gameId || typeof gameId !== 'string') {
    return { success: false, error: 'Invalid game ID' };
  }
  
  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return { success: false, error: 'Rating must be between 1 and 5' };
  }

  try {
    // 使用辅助函数同步评分数据
    await syncRatingToGameRatings(gameId, rating);

    // 获取更新后的评分数据
    const result = await turso.execute({
      sql: `
        SELECT average_rating, total_ratings,
               rating_1_count, rating_2_count, rating_3_count, rating_4_count, rating_5_count
        FROM game_ratings 
        WHERE game_id = ? AND project_id = ? AND locale = ?
      `,
      args: [gameId, projectId, locale]
    });

    if (result.rows.length === 0) {
      return { success: false, error: 'Failed to retrieve updated rating' };
    }

    const row = result.rows[0];
    const data = {
      averageRating: Math.round((row.average_rating as number) * 10) / 10,
      totalRatings: row.total_ratings as number,
      ratingDistribution: {
        1: (row.rating_1_count as number) || 0,
        2: (row.rating_2_count as number) || 0,
        3: (row.rating_3_count as number) || 0,
        4: (row.rating_4_count as number) || 0,
        5: (row.rating_5_count as number) || 0
      }
    };

    // 彻底清除所有相关缓存 - 终极修复版
    await clearAllGameCaches(gameId);

    return { success: true, data };

  } catch (error) {
    console.error('Error saving game rating:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Database error' 
    };
  }
}

// 获取游戏评分信息 - 实时数据，不使用缓存
export async function getGameRating(
  gameId: string
): Promise<{
  success: boolean;
  data?: {
    averageRating: number;
    totalRatings: number;
    ratingDistribution: Record<number, number>;
  };
  error?: string;
}> {
  const { projectId, locale } = getProjectConfig();

  if (!gameId || typeof gameId !== 'string') {
    return { success: false, error: 'Invalid game ID' };
  }

  try {
    const result = await turso.execute({
      sql: `
        SELECT average_rating, total_ratings,
               rating_1_count, rating_2_count, rating_3_count, rating_4_count, rating_5_count
        FROM game_ratings 
        WHERE game_id = ? AND project_id = ? AND locale = ?
      `,
      args: [gameId, projectId, locale]
    });

    const data = {
      averageRating: result.rows[0] ? Math.round((result.rows[0].average_rating as number) * 10) / 10 : 0,
      totalRatings: result.rows[0] ? (result.rows[0].total_ratings as number) : 0,
      ratingDistribution: {
        1: result.rows[0] ? ((result.rows[0].rating_1_count as number) || 0) : 0,
        2: result.rows[0] ? ((result.rows[0].rating_2_count as number) || 0) : 0,
        3: result.rows[0] ? ((result.rows[0].rating_3_count as number) || 0) : 0,
        4: result.rows[0] ? ((result.rows[0].rating_4_count as number) || 0) : 0,
        5: result.rows[0] ? ((result.rows[0].rating_5_count as number) || 0) : 0
      }
    };

    const response = { success: true, data };
    
    // 不缓存评分查询结果，确保数据实时性
    // setCache(cacheKey, response, [`game:${gameId}`, 'rating']); // 禁用缓存
    
    return response;

  } catch (error) {
    console.error('Error fetching game rating:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Database error' 
    };
  }
}

// 彻底清除游戏相关的所有缓存
async function clearAllGameCaches(gameId: string): Promise<void> {
  try {
    // 1. 清除内存缓存中的所有相关项
    clearCache(gameId); // 模式匹配清除
    cacheManager.invalidateByDependency(`game:${gameId}`); // 依赖清除
    
    // 2. 清除特定缓存键
    const { projectId, locale } = getProjectConfig();
    const keysToDelete = [
      getCacheKey('getGameRating', { gameId, projectId, locale }),
      getCacheKey('getGameById', { gameId, projectId, locale }),
      getCacheKey('getMainGame', { projectId, locale }),
      getCacheKey('getAllGames', { projectId, locale }),
      `rating-${gameId}`,
      `game-${gameId}`
    ];
    
    keysToDelete.forEach(key => {
      cacheManager.delete(key);
    });
    
    // 3. 清除浏览器缓存
    await cacheManager.clearBrowserCache(`rating?gameId=${gameId}`);
    await cacheManager.clearBrowserCache(`games/${gameId}`);
    
    console.log(`Cleared all caches for game: ${gameId}`);
  } catch (error) {
    console.warn('Error clearing game caches:', error);
  }
}

// 获取相关游戏 - 基于标签相似度
export async function getRelatedGames(
  currentGameId: string, 
  limit: number = 16
): Promise<GameProps[]> {
  const { projectId, locale } = getProjectConfig();
  const cacheKey = getCacheKey('getRelatedGames', { currentGameId, projectId, locale, limit });
  
  // 检查缓存
  const cached = getFromCache<GameProps[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // 第一步：获取当前游戏的所有分类
    const currentGameCategoriesQuery = `
      SELECT DISTINCT c.id as category_id, c.name as category_name
      FROM project_games pg
      INNER JOIN project_game_categories pgc ON pg.id = pgc.project_game_id
      INNER JOIN project_categories pc ON pgc.project_category_id = pc.id
      INNER JOIN categories c ON pc.category_id = c.id
      WHERE pg.project_id = ? 
        AND pg.locale = ?
        AND pg.game_id = ?
        AND pg.is_published = 1
        AND c.name NOT IN ('Hot Games', 'New Games') -- 排除hot和new标签
    `;

    const currentGameCategoriesResult = await turso.execute({
      sql: currentGameCategoriesQuery,
      args: [projectId, locale, currentGameId]
    });

    if (currentGameCategoriesResult.rows.length === 0) {
      // 如果当前游戏没有分类，返回评分最高的游戏
      const fallbackQuery = `
        SELECT 
          pg.game_id as gameId,
          pg.title,
          pg.content,
          pg.metadata,
          gb.metadata as baseMetadata,
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
          AND pg.game_id != ?
          AND pg.is_published = 1
        GROUP BY pg.id, gr.average_rating, gr.total_ratings
        ORDER BY gr.average_rating DESC, gb.created_at DESC
        LIMIT ?
      `;

      const fallbackResult = await turso.execute({
        sql: fallbackQuery,
        args: [projectId, locale, currentGameId, limit]
      });

      const fallbackGames = fallbackResult.rows.map(transformDbResultToGame);
      setCacheWithType(cacheKey, fallbackGames, 'games', [`game:${currentGameId}`, 'related']);
      return fallbackGames;
    }

    const currentGameCategories = currentGameCategoriesResult.rows.map(row => ({
      id: row.category_id as string,
      name: row.category_name as string
    }));

    // 第二步：获取所有其他游戏及其分类，计算相似度
    const allGamesQuery = `
      SELECT 
        pg.game_id as gameId,
        pg.title,
        pg.content,
        pg.metadata,
        gb.metadata as baseMetadata,
        gb.iframe_url as iframeUrl,
        gb.image_url as imageUrl,
        gb.created_at as createdAt,
        COALESCE(gr.average_rating, 0) as averageRating,
        COALESCE(gr.total_ratings, 0) as totalRatings,
        GROUP_CONCAT(c.name) as categories,
        GROUP_CONCAT(c.id) as category_ids
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
        AND pg.game_id != ?
        AND pg.is_published = 1
      GROUP BY pg.id, gr.average_rating, gr.total_ratings
    `;

    const allGamesResult = await turso.execute({
      sql: allGamesQuery,
      args: [projectId, locale, currentGameId]
    });

    // 第三步：计算相似度并排序
    const gamesWithSimilarity = allGamesResult.rows.map(row => {
      const game = transformDbResultToGame(row);
      const gameCategoryIds = row.category_ids ? 
        (row.category_ids as string).split(',').filter((id: string) => id && id.trim()) : 
        [];
      
      // 计算Jaccard相似度
      const currentCategoryIds = currentGameCategories.map(cat => cat.id);
      const intersection = gameCategoryIds.filter(id => 
        currentCategoryIds.includes(id)
      ).length;
      const union = new Set([...currentCategoryIds, ...gameCategoryIds]).size;
      const similarity = union > 0 ? intersection / union : 0;

      return {
        ...game,
        similarity
      };
    });

    // 按相似度降序排序，相似度相同时按评分排序
    const sortedGames = gamesWithSimilarity
      .sort((a, b) => {
        if (Math.abs(a.similarity - b.similarity) < 0.01) {
          // 相似度相近时，按评分排序
          return (b.rating?.averageRating || 0) - (a.rating?.averageRating || 0);
        }
        return b.similarity - a.similarity;
      })
      .slice(0, limit)
      .map(({ similarity, ...game }) => game); // 移除similarity字段

    // 缓存结果（30分钟）
    setCacheWithType(cacheKey, sortedGames, 'games', [`game:${currentGameId}`, 'related']);
    
    return sortedGames;

  } catch (error) {
    console.error('Error fetching related games:', error);
    return [];
  }
}

// 获取缓存统计信息（调试用）
export function getCacheStats() {
  return cacheManager.getStats();
}