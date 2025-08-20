import React from 'react';

// 前端使用的游戏类型
export interface GameProps {
  id: string;
  title: string;
  image: string;
  rating: {
    averageRating: number;
    totalRatings: number;
  };
  categories: string[];
  iframeUrl: string;
  createdAt: string;
  content: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// 游戏详情页面组件属性
export interface GameDetailProps {
  game: GameProps;
  isMain?: boolean; // 是否为主页游戏，如果为true则不显示面包屑导航
}

// 评论数据类型
export interface GameComment {
  id: string;
  content: string;
  nickname: string;
  email?: string;
  gameId?: string;
  ratingScore?: number;
  helpfulVotes: number;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// 数据库查询结果类型 (内部使用)
export interface DbGameResult {
  // 来自 projectGames 表
  gameId: string;
  title: string;
  content: string;
  metadata: string; // JSON string
  
  // 来自 gamesBase 表  
  iframeUrl: string;
  imageUrl: string;
  createdAt: string;
  
  // 来自 gameRatings 表
  averageRating: number;
  totalRatings: number;
  
  // 分类信息
  categories: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
  stats?: {
    total: number;
    approved: number;
    pending: number;
    averageRating?: number;
  };
  meta?: Record<string, any>;
}

// 分页参数类型
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

// 游戏查询参数类型
export interface GameQueryParams extends PaginationParams {
  projectId?: string;
  locale?: string;
  categoryId?: string;
  isMain?: boolean;
}

// Markdown 渲染器属性类型
export interface MarkdownRendererProps {
  content: string;
  className?: string;
  components?: Record<string, React.ComponentType<any>>;
}
