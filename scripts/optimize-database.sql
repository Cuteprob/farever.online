-- 数据库性能优化脚本
-- 为获取主页面游戏的查询创建优化索引

-- 1. 项目游戏表的复合索引 - 用于主游戏查询
CREATE INDEX IF NOT EXISTS idx_project_games_main_query 
ON project_games (project_id, locale, is_main, is_published, game_id);

-- 2. 项目游戏表的创建时间索引 - 用于排序
CREATE INDEX IF NOT EXISTS idx_project_games_created_at 
ON project_games (created_at DESC);

-- 3. 游戏基础表的创建时间索引 - 用于排序
CREATE INDEX IF NOT EXISTS idx_games_base_created_at 
ON games_base (created_at DESC);

-- 4. 游戏评分表的复合索引 - 用于评分查询
CREATE INDEX IF NOT EXISTS idx_game_ratings_lookup 
ON game_ratings (game_id, project_id, locale);

-- 5. 游戏评分表的评分排序索引
CREATE INDEX IF NOT EXISTS idx_game_ratings_score 
ON game_ratings (average_rating DESC);

-- 6. 游戏评论表的复合索引 - 用于评论查询
CREATE INDEX IF NOT EXISTS idx_game_comments_lookup 
ON game_comments (game_id, project_id, locale, status);

-- 7. 游戏评论表的排序索引
CREATE INDEX IF NOT EXISTS idx_game_comments_sort 
ON game_comments (helpful_votes DESC, created_at DESC);

-- 8. 项目游戏分类关联表索引
CREATE INDEX IF NOT EXISTS idx_project_game_categories_lookup 
ON project_game_categories (project_game_id);

-- 9. 项目分类表索引
CREATE INDEX IF NOT EXISTS idx_project_categories_lookup 
ON project_categories (id, category_id);

-- 10. 分类表名称索引 - 用于分类查询
CREATE INDEX IF NOT EXISTS idx_categories_name 
ON categories (name);

-- 查询统计信息
SELECT 
  'project_games' as table_name,
  COUNT(*) as row_count
FROM project_games
UNION ALL
SELECT 
  'games_base' as table_name,
  COUNT(*) as row_count
FROM games_base
UNION ALL
SELECT 
  'game_ratings' as table_name,
  COUNT(*) as row_count
FROM game_ratings
UNION ALL
SELECT 
  'game_comments' as table_name,
  COUNT(*) as row_count
FROM game_comments;

-- 验证索引是否创建成功
SELECT 
  name as index_name,
  tbl_name as table_name,
  sql as definition
FROM sqlite_master 
WHERE type = 'index' 
  AND name LIKE 'idx_%'
ORDER BY tbl_name, name;
