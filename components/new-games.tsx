"use client"

import { GameRecommendationSection, createGameRecommendationConfig } from "@/components/GameRecommendationSection"

interface NewGamesProps {
  limit?: number;
  showTitle?: boolean;
  title?: string;
}

export function NewGames({ 
  limit = 16, 
  showTitle = true, 
  title = "Latest New Games" 
}: NewGamesProps) {
  // 创建新游戏推荐配置
  const config = createGameRecommendationConfig.newGames(limit);
  
  // 应用自定义标题配置，确保保留enableLazyLoad设置
  const finalConfig = {
    ...config,
    title,
    showTitle,
    subtitle: showTitle ? "Discover the newest games just added to our collection" : undefined
  };

  return (
    <GameRecommendationSection config={finalConfig} />
  );
}