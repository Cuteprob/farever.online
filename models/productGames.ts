import { turso } from "@/models/tursoDb";

export type GameCategory = string; // 添加类型定义

export interface Game {
  id: string;
  title: string;
  description: string;
  iframeUrl: string;
  image: string;
  rating: number;
  createdAt: string;
  categories: GameCategory[];
  metadata: any;
  features: any;
  faqs: any;
  controls: any;
  video?: any;
}

interface GameRow {
  id: string;
  title: string;
  description: string;
  iframeUrl: string;
  imageUrl: string;
  rating: number | null;
  createdAt: string;
  video: string | null;
  metadata: string;
  features: string;
  faqs: string;
  controls: string;
  categoryNames: string;
}

export const getProjectGamesByCategoryId = async (
  categoryId: string
): Promise<Game[]> => {
  try {

    const query = `
      SELECT 
        pg.game_id as id,
        pg.title,
        pg.description,
        gb.iframe_url as iframeUrl,
        gb.image_url as imageUrl,
        gb.rating,
        gb.created_at as createdAt,
        gb.video,
        pg.metadata,
        pg.features,
        pg.faqs,
        GROUP_CONCAT(c.name) as categoryNames
      FROM project_games pg
      INNER JOIN games_base gb ON gb.id = pg.game_id
      INNER JOIN game_categories gc ON gc.game_id = pg.game_id
      INNER JOIN categories c ON c.id = gc.category_id
      WHERE pg.project_id = 'sprunksters-top'
        AND pg.locale = 'en'
        AND pg.is_published =1
        AND gc.category_id = ?
      GROUP BY pg.game_id
      ORDER BY gb.created_at DESC
    `;

    const result = await turso.execute({
      sql: query,
      args: [categoryId]
    });


    return (result.rows as unknown as GameRow[]).map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      iframeUrl: row.iframeUrl,
      image: row.imageUrl,
      rating: row.rating ?? 0,
      createdAt: row.createdAt,
      categories: row.categoryNames.split(',') as GameCategory[],
      metadata: JSON.parse(row.metadata),
      features: JSON.parse(row.features),
      faqs: JSON.parse(row.faqs),
      controls: JSON.parse(row.metadata).controls,
      video: row.video ? JSON.parse(row.video) : undefined
    }));
  } catch (error) {
    console.error("Error fetching project games by category:", error);
    throw error;
  }
};

// 获取单个游戏详情
export const getGameById = async (id: string): Promise<Game | null> => {
  try {
    const query = `
      SELECT 
        pg.game_id as id,
        pg.title,
        pg.description,
        gb.iframe_url as iframeUrl,
        gb.image_url as imageUrl,
        gb.rating,
        gb.created_at as createdAt,
        gb.video,
        pg.metadata,
        pg.controls,
        pg.features,
        pg.faqs,
        GROUP_CONCAT(c.name) as categoryNames
      FROM project_games pg
      INNER JOIN games_base gb ON gb.id = pg.game_id
      INNER JOIN game_categories gc ON gc.game_id = pg.game_id
      INNER JOIN categories c ON c.id = gc.category_id
      WHERE pg.game_id = ?
        AND pg.project_id = 'sprunksters-top'
        AND pg.locale = 'en'
      GROUP BY pg.game_id
    `;

    const result = await turso.execute({ sql: query, args: [id] });
    const row = result.rows[0] as unknown as GameRow;
    
    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      iframeUrl: row.iframeUrl,
      image: row.imageUrl,
      rating: row.rating ?? 0,
      createdAt: row.createdAt,
      categories: row.categoryNames.split(',') as GameCategory[],
      metadata: JSON.parse(row.metadata),
      features: JSON.parse(row.features),
      faqs: JSON.parse(row.faqs),
      controls: JSON.parse(row.controls),
      video: row.video ? JSON.parse(row.video) : undefined
    };
  } catch (error) {
    console.error("Error fetching game by id:", error);
    throw error;
  }
};

// 获取项目所有游戏
export const getAllGames = async (): Promise<Game[]> => {
  try {
    const query = `
      SELECT 
        pg.game_id as id,
        pg.title,
        pg.description,
        gb.iframe_url as iframeUrl,
        gb.image_url as imageUrl,
        gb.rating,
        gb.created_at as createdAt,
        gb.video,
        pg.metadata,
        pg.controls,
        pg.features,
        pg.faqs,
        GROUP_CONCAT(c.name) as categoryNames
      FROM project_games pg
      INNER JOIN games_base gb ON gb.id = pg.game_id
      INNER JOIN game_categories gc ON gc.game_id = pg.game_id
      INNER JOIN categories c ON c.id = gc.category_id
      WHERE pg.project_id = 'sprunksters-top'
        AND pg.locale = 'en'
        AND pg.is_published =1
      GROUP BY pg.game_id
      ORDER BY gb.created_at DESC
    `;

    const result = await turso.execute({ 
      sql: query,
      args: []
    });
    const rows = result.rows as unknown as GameRow[];

    return rows.map(row => {
      try {
        return {
          id: row.id,
          title: row.title,
          description: row.description,
          iframeUrl: row.iframeUrl,
          image: row.imageUrl,
          rating: row.rating ?? 0,
          createdAt: row.createdAt,
          categories: row.categoryNames.split(',') as GameCategory[],
          metadata: JSON.parse(row.metadata || '{}'),
          features: JSON.parse(row.features || '[]'),
          faqs: JSON.parse(row.faqs || '[]'),
          controls: JSON.parse(row.controls || '{}'),
          video: row.video ? JSON.parse(row.video) : undefined
        };
      } catch (error) {
        console.error('Error parsing game data:', error, row);
        return {
          id: row.id,
          title: row.title,
          description: row.description,
          iframeUrl: row.iframeUrl,
          image: row.imageUrl,
          rating: row.rating ?? 0,
          createdAt: row.createdAt,
          categories: row.categoryNames.split(',') as GameCategory[],
          metadata: {},
          features: [],
          faqs: [],
          controls: {},
          video: undefined
        };
      }
    });
  } catch (error) {
    console.error("Error fetching all games:", error);
    throw error;
  }
};
