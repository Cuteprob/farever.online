import { turso } from "@/models/tursoDb";
import { GameProps, GameComment, DbGameResult, GameQueryParams } from "@/types/game";
import { transformDbResultToGame } from "@/lib/format";
import { log } from "@/utils/logger";



// 获取项目ID和语言配置
function getProjectConfig() {
  return {
    projectId: process.env.PROJECT_ID || '',
    locale: 'en' // 默认英语
  };
}

// 获取主页面游戏 (isMain=1) - 只返回一个游戏，带重试机制确保数据一致性
export async function getMainGame(): Promise<GameProps | null> {
  const { projectId, locale } = getProjectConfig();

  const query = `
    SELECT
  pg.game_id AS gameId,
  pg.title,
  pg.content,
  pg.metadata,
  gb.metadata AS baseMetadata,
  gb.iframe_url AS iframeUrl,
  gb.image_url AS imageUrl,
  gb.created_at AS createdAt,
  COALESCE(gr.average_rating, 0)  AS averageRating,
  COALESCE(gr.total_ratings, 0)   AS totalRatings,
  cat.categories
FROM project_games pg
JOIN games_base gb
  ON gb.id = pg.game_id
LEFT JOIN game_ratings gr
  ON gr.game_id    = pg.game_id
 AND gr.project_id = pg.project_id
 AND gr.locale     = pg.locale
LEFT JOIN (
   SELECT
     pgc.project_game_id,
     GROUP_CONCAT(c.name) AS categories
   FROM project_game_categories pgc
   JOIN project_categories pc ON pc.id = pgc.project_category_id
   JOIN categories c          ON c.id = pc.category_id
   WHERE pc.is_active = 1
   GROUP BY pgc.project_game_id
) cat ON cat.project_game_id = pg.id
WHERE pg.project_id   = ?
  AND pg.locale       = ?
  AND pg.is_main      = 1
  AND pg.is_published = 1
ORDER BY averageRating DESC, createdAt DESC, pg.id DESC
LIMIT 1;

  `;

  // 使用重试机制和一致性验证来处理Turso数据库的读取一致性问题
  const maxRetries = 3;
  let lastGame: GameProps | null = null;
  let consistentResults = 0;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      log.debug(`getMainGame attempt ${attempt}/${maxRetries}`, { attempt, maxRetries, projectId, locale });
      
      const result = await turso.execute({
        sql: query,
        args: [projectId, locale]
      });

      if (result.rows.length === 0) {
        log.debug(`getMainGame attempt ${attempt}: no data found`, { attempt, projectId, locale });
        if (attempt === maxRetries) {
          return null;
        }
        continue;
      }
      
      const game = transformDbResultToGame(result.rows[0]);
      log.debug(`getMainGame attempt ${attempt} categories`, { attempt, categories: game.categories, gameId: game.id });
      
      // 检查数据一致性
      if (lastGame === null) {
        lastGame = game;
        consistentResults = 1;
      } else if (JSON.stringify(game.categories) === JSON.stringify(lastGame.categories)) {
        consistentResults++;
        log.debug(`getMainGame consistent results: ${consistentResults}`, { consistentResults, attempt });
      } else {
        log.warn(`getMainGame data inconsistency detected`, {
          previous: lastGame.categories,
          current: game.categories,
          attempt
        });
        lastGame = game;
        consistentResults = 1;
      }
      
      // 如果连续两次结果一致，或者是最后一次尝试，返回结果
      if (consistentResults >= 2 || attempt === maxRetries) {
        log.info(`getMainGame final result after ${attempt} attempts`, { 
          attempt, 
          categories: game.categories, 
          gameId: game.id,
          consistentResults 
        });
        return game;
      }
      
      // 短暂延迟后重试，等待数据同步
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
    } catch (error) {
      log.error(`Error fetching main game (attempt ${attempt})`, error, { attempt, maxRetries, projectId, locale });
      if (attempt === maxRetries) {
        return null;
      }
      // 重试前等待更长时间
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  return lastGame;
}

// 获取游戏评论
export async function getGameComments(
  gameId?: string,
  limit: number = 20,
  offset: number = 0
): Promise<GameComment[]> {
  const { projectId, locale } = getProjectConfig();
  
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

    return comments;
  } catch (error) {
    log.error('Error fetching game comments', error, { gameId, limit, offset });
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

    return stats;
  } catch (error) {
    console.error('Error fetching comment stats:', error);
    return { total: 0, approved: 0, pending: 0 };
  }
}

// 获取所有游戏
export async function getAllGames(
  params: GameQueryParams = {}
): Promise<GameProps[]> {
  const { projectId, locale } = getProjectConfig();
  const { limit, offset = 0, categoryId, isMain } = params;
  
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

// 获取单个游戏详情
export async function getGameById(gameId: string): Promise<GameProps | null> {
  const { projectId, locale } = getProjectConfig();

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

// 关于缓存：本项目已禁用数据层缓存，使用API层统一缓存策略

// 获取所有可用分类
export async function getAllCategories(): Promise<Array<{
  id: string;
  name: string;
  description?: string;
  slug: string;
  gameCount: number;
}>> {
  const { projectId, locale } = getProjectConfig();
  
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
      slug: (row.name as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      gameCount: parseInt(row.game_count as string) || 0
    }));

    // 打印游戏种类信息日志
    console.log('游戏种类信息:', {
      totalCategories: categories.length,
      categories: categories.map(cat => ({
        name: cat.name,
        slug: cat.slug,
        gameCount: cat.gameCount
      }))
    });

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
  
  const foundCategory = categories.find(cat => cat.slug === slug);
  
  // 生产环境调试日志
  if (process.env.NODE_ENV !== 'development' && !foundCategory) {
    console.log(`getCategoryBySlug: slug="${slug}" not found. Available slugs: ${categories.map(c => c.slug).join(', ')}`);
  }
  
  return foundCategory || null;
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

    return { success: true, data };

  } catch (error) {
    console.error('Error fetching game rating:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Database error' 
    };
  }
}

// 获取相关游戏 - 基于标签相似度
export async function getRelatedGames(
  currentGameId: string, 
  limit: number = 16
): Promise<GameProps[]> {
  const { projectId, locale } = getProjectConfig();

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

    return sortedGames;

  } catch (error) {
    console.error('Error fetching related games:', error);
    return [];
  }
}

// 注意：缓存相关功能已移至 utils/cache-config.ts 和 utils/logger.ts