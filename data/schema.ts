import { 
    sqliteTable, 
    text, 
    integer, 
    real,
    primaryKey,
    index
  } from "drizzle-orm/sqlite-core";
  import { sql } from "drizzle-orm";
  import { relations } from 'drizzle-orm';
  
  // 原始游戏数据表
  export const gamesBase = sqliteTable('games_base', {
    id: text('id').primaryKey(),                    // 游戏唯一标识符
    title: text('title').notNull(),                 // 游戏标题
    iframeUrl: text('iframe_url').notNull(),        // 游戏iframe地址
    imageUrl: text('image_url').notNull(),          // 游戏图片URL
    rating: real('rating').default(0),              // 游戏评分
    createdAt: text('created_at').notNull(),        // 创建时间
    metadata: text('metadata').notNull(),           // JSON as text
    content: text('content'),                      // Markdown content as text
    updatedAt: text('updated_at')
      .default(sql`CURRENT_TIMESTAMP`),            // 更新时间
  });
  
  // 游戏分类表
  export const categories = sqliteTable('categories', {
    id: text('id').primaryKey(),                    // 分类ID，如 'MUSIC'
    name: text('name').notNull(),                   // 显示名称，如 'Music Games'
    description: text('description'),                // 分类描述
    createdAt: text('created_at')
      .default(sql`CURRENT_TIMESTAMP`),            // 创建时间
  });
  
  // 游戏-分类关联表（多对多）
  export const gameCategories = sqliteTable('game_categories', {
    gameId: text('game_id')
      .notNull()
      .references(() => gamesBase.id, { onDelete: 'cascade' }),
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
    createdAt: text('created_at')
      .default(sql`CURRENT_TIMESTAMP`),
  }, (table) => ({
    pk: primaryKey(table.gameId, table.categoryId),  // 复合主键
  }));
  
  // 项目特定游戏数据表
  export const projectGames = sqliteTable('project_games', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    projectId: text('project_id').notNull(),
    gameId: text('game_id')
      .notNull()
      .references(() => gamesBase.id),
    locale: text('locale').notNull(),
    title: text('title').notNull(),
    metadata: text('metadata').notNull(),
    content: text('content'),                      // Markdown content as text
    baseVersion: integer('base_version').notNull(),
    isPublished: integer('is_published').default(0),
    isMain: integer('is_main').default(0),         // 是否为主游戏
    createdAt: text('created_at')
      .default(sql`CURRENT_TIMESTAMP`),
  }, (table) => ({
    unq: index('project_game_unique').on(table.projectId, table.gameId, table.locale)
  }));
  
  // 项目表
  export const projects = sqliteTable('projects', {
    id: text('id').primaryKey(),  // 使用 nanoid
    name: text('name').notNull(),
    description: text('description'),
    defaultLocale: text('default_locale').notNull(),
    locales: text('locales').notNull(), // JSON 数组存储支持的语言
    aiConfig: text('ai_config').notNull().default('{}'), // AI 配置: { targetAudience, tone, defaultPrompts }
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
  })
  
  // 项目特定分类表
  export const projectCategories = sqliteTable('project_categories', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
    displayName: text('display_name'),              // 项目中的显示名称，可以覆盖原始分类名
    description: text('description'),               // 项目中的分类描述
    sortOrder: integer('sort_order').default(0),    // 排序顺序
    isActive: integer('is_active').default(1),      // 是否激活
    createdAt: text('created_at')
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at')
      .default(sql`CURRENT_TIMESTAMP`),
  }, (table) => ({
    // 确保每个项目中的分类是唯一的
    unq: index('project_category_unique').on(table.projectId, table.categoryId)
  }));
  
  // 项目游戏-分类关联表
  export const projectGameCategories = sqliteTable('project_game_categories', {
    projectGameId: integer('project_game_id')
      .notNull()
      .references(() => projectGames.id, { onDelete: 'cascade' }),
    projectCategoryId: integer('project_category_id')
      .notNull()
      .references(() => projectCategories.id, { onDelete: 'cascade' }),
    createdAt: text('created_at')
      .default(sql`CURRENT_TIMESTAMP`),
  }, (table) => ({
    pk: primaryKey(table.projectGameId, table.projectCategoryId),  // 复合主键
  }));
  
  // 类型定义
  export type GameBase = typeof gamesBase.$inferSelect;
  export type NewGameBase = typeof gamesBase.$inferInsert;
  
  export type Category = typeof categories.$inferSelect;
  export type NewCategory = typeof categories.$inferInsert;
  
  export type GameCategory = typeof gameCategories.$inferSelect;
  export type NewGameCategory = typeof gameCategories.$inferInsert;
  
  export type ProjectGame = typeof projectGames.$inferSelect;
  export type NewProjectGame = typeof projectGames.$inferInsert;
  
  export type ProjectCategory = typeof projectCategories.$inferSelect;
  export type NewProjectCategory = typeof projectCategories.$inferInsert;
  
  export type ProjectGameCategory = typeof projectGameCategories.$inferSelect;
  export type NewProjectGameCategory = typeof projectGameCategories.$inferInsert;
  
  // 定义关系
  export const gamesBaseRelations = relations(gamesBase, ({ many }) => ({
    categories: many(gameCategories)
  }));
  
  export const gameCategoriesRelations = relations(gameCategories, ({ one }) => ({
    game: one(gamesBase, {
      fields: [gameCategories.gameId],
      references: [gamesBase.id],
    }),
    category: one(categories, {
      fields: [gameCategories.categoryId],
      references: [categories.id],
    }),
  }));
  
  export const categoriesRelations = relations(categories, ({ many }) => ({
    games: many(gameCategories)
  }));
  
  // 添加 projectGames 的关系定义
  export const projectGamesRelations = relations(projectGames, ({ one, many }) => ({
    game: one(gamesBase, {
      fields: [projectGames.gameId],
      references: [gamesBase.id],
    }),
    categories: many(projectGameCategories)
  }));
  
  export const projectGameCategoriesRelations = relations(projectGameCategories, ({ one }) => ({
    projectGame: one(projectGames, {
      fields: [projectGameCategories.projectGameId],
      references: [projectGames.id],
    }),
    projectCategory: one(projectCategories, {
      fields: [projectGameCategories.projectCategoryId],
      references: [projectCategories.id],
    })
  }));
  
  export const projectCategoriesRelations = relations(projectCategories, ({ one, many }) => ({
    project: one(projects, {
      fields: [projectCategories.projectId],
      references: [projects.id],
    }),
    category: one(categories, {
      fields: [projectCategories.categoryId],
      references: [categories.id],
    }),
    games: many(projectGameCategories)
  }));
  
  export const projectsRelations = relations(projects, ({ many }) => ({
    categories: many(projectCategories),
    comments: many(gameComments),
    ratings: many(gameRatings)
  }));
  
  // 游戏评论表
  export const gameComments = sqliteTable('game_comments', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    content: text('content').notNull(),                          // 评论内容
    nickname: text('nickname').notNull(),                        // 用户昵称
    email: text('email'),                                        // 邮箱(可选)
    gameId: text('game_id')
      .notNull()
      .references(() => gamesBase.id, { onDelete: 'cascade' }),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    locale: text('locale').notNull(),                            // 语言环境
    ratingScore: integer('rating_score'),                        // 用户评分(0-5)
    status: text('status').notNull().default('pending'),         // 审核状态
    helpfulVotes: integer('helpful_votes').default(0),           // 有用投票数
    createdAt: text('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at')
      .default(sql`CURRENT_TIMESTAMP`),
    moderatedAt: text('moderated_at'),                           // 审核时间
  }, (table) => ({
    gameProjectIdx: index('idx_game_comments_game_project').on(table.gameId, table.projectId),
    statusIdx: index('idx_game_comments_status').on(table.status),
    createdAtIdx: index('idx_game_comments_created_at').on(table.createdAt),
  }));
  
  // 游戏评分汇总表 (优化版本 - 无外键约束，独立评分计数列)
export const gameRatings = sqliteTable('game_ratings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  gameId: text('game_id').notNull(),                          // 游戏ID (无外键约束)
  projectId: text('project_id').notNull(),                    // 项目ID (无外键约束)
  locale: text('locale').notNull(),                           // 语言环境
  averageRating: real('average_rating').default(0),          // 平均评分
  totalRatings: integer('total_ratings').default(0),         // 总评分数
  rating1Count: integer('rating_1_count').default(0),        // 1星评分数
  rating2Count: integer('rating_2_count').default(0),        // 2星评分数
  rating3Count: integer('rating_3_count').default(0),        // 3星评分数
  rating4Count: integer('rating_4_count').default(0),        // 4星评分数
  rating5Count: integer('rating_5_count').default(0),        // 5星评分数
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  uniqueIdx: index('idx_game_ratings_unique').on(table.gameId, table.projectId, table.locale),
  gameIdx: index('idx_game_ratings_game').on(table.gameId),
  projectIdx: index('idx_game_ratings_project').on(table.projectId),
}));
  
  // 类型定义
  export type GameComment = typeof gameComments.$inferSelect;
  export type NewGameComment = typeof gameComments.$inferInsert;
  
  export type GameRating = typeof gameRatings.$inferSelect;
  export type NewGameRating = typeof gameRatings.$inferInsert;
  
  // 扩展现有的关系定义
  export const gameCommentsRelations = relations(gameComments, ({ one }) => ({
    game: one(gamesBase, {
      fields: [gameComments.gameId],
      references: [gamesBase.id],
    }),
    project: one(projects, {
      fields: [gameComments.projectId],
      references: [projects.id],
    }),
  }));
  
  // 注意：gameRatings 现在没有外键约束，所以关系是逻辑性的而非强制性的
export const gameRatingsRelations = relations(gameRatings, ({ one }) => ({
  game: one(gamesBase, {
    fields: [gameRatings.gameId],
    references: [gamesBase.id],
  }),
  project: one(projects, {
    fields: [gameRatings.projectId],
    references: [projects.id],
  }),
}));
  
  // 扩展现有的游戏基础数据关系
  export const gamesBaseRelationsExtended = relations(gamesBase, ({ many }) => ({
    categories: many(gameCategories),
    comments: many(gameComments),
    ratings: many(gameRatings)
  }));
  