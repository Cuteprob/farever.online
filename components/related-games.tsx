"use client"

import { GameRecommendationSection, createGameRecommendationConfig } from "@/components/GameRecommendationSection"

interface RelatedGamesProps {
  currentGameId?: string;
}

export function RelatedGames({ currentGameId }: RelatedGamesProps) {
  // 如果没有当前游戏ID，不显示相关游戏
  if (!currentGameId) {
    return null;
  }

  // 使用预设配置创建相关游戏推荐配置
  const config = createGameRecommendationConfig.relatedGames(currentGameId);

  return (
    <GameRecommendationSection config={config} currentGameId={currentGameId} />
  );
}