
  // 原始游戏数据表
  export const gamesBase = sqliteTable('games_base', {
    id: text('id').primaryKey(),                    // 游戏唯一标识符
    title: text('title').notNull(),                 // 游戏标题
    description: text('description').notNull(),      // 游戏描述
    iframeUrl: text('iframe_url').notNull(),        // 游戏iframe地址
    imageUrl: text('image_url').notNull(),          // 游戏图片URL
    rating: real('rating').default(0),              // 游戏评分
    createdAt: text('created_at').notNull(),        // 创建时间
    metadata: text('metadata').notNull(),           // JSON as text
    controls: text('controls').notNull(),           // JSON as text
    features: text('features').notNull(),           // JSON as text
    faqs: text('faqs').notNull(),                  // JSON as text
    video: text('video'),                          // JSON as text
    version: integer('version').default(1),         // 版本号
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
    description: text('description').notNull(),
    metadata: text('metadata').notNull(),
    controls: text('controls').notNull(),
    features: text('features').notNull(),
    faqs: text('faqs').notNull(),
    baseVersion: integer('base_version').notNull(),
    isPublished: integer('is_published').default(0),
    createdAt: text('created_at')
      .default(sql`CURRENT_TIMESTAMP`),
  }, (table) => ({
    unq: index('project_game_unique').on(table.projectId, table.gameId, table.locale)
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
  export const projectGamesRelations = relations(projectGames, ({ one }) => ({
    game: one(gamesBase, {
      fields: [projectGames.gameId],
      references: [gamesBase.id],
    })
  }));
  