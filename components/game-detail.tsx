'use client';

import React from 'react';
import { GameProps } from '@/types/game';
import LazyMarkdownRenderer from '@/components/LazyMarkdownRenderer';
import { GameContainer } from '@/components/game-container';
import { GameContainerLG } from '@/components/game-container-lg';
import { Comments } from './comments';
import { RelatedGames } from './related-games';
import { GameRecommendationSection, createGameRecommendationConfig } from '@/components/GameRecommendationSection';
import { Categories } from './categories';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { NewGames } from './new-games';

interface GameDetailProps {
  game: any; // 保持原有类型
  isMain?: boolean;
  containerSize?: '5xl' | '7xl'; // 新增：容器大小控制
}

const GameDetail: React.FC<GameDetailProps> = ({ game, isMain = false, containerSize = '7xl' }) => {
  const { content } = game;

  // 创建游戏容器需要的 Game 对象 - 适配新的评分数据结构
  const gameForContainer: GameProps = {
    id: game.id,
    title: game.title,
    image: game.image,
    iframeUrl: game.iframeUrl || '', // 提供默认值
    content: game.content,
    rating: {
      averageRating: game.rating.averageRating,
      totalRatings: game.rating.totalRatings
    },
    categories: [], // 暂时使用空数组，因为类型不匹配
    createdAt: game.createdAt,
    metadata: {
      title: game.metadata?.title || game.title,
      description: game.metadata?.description || '',
      keywords: game.metadata?.keywords || []
    }
  };

  // 根据容器大小决定使用哪个游戏容器组件
  const GameContainerComponent = containerSize === '5xl' ? GameContainer : GameContainerLG;
  
  // 根据容器大小决定整体布局
  const isCompactLayout = containerSize === '5xl';

  // 为右侧栏创建特殊的相关游戏配置
  const sidebarRelatedGamesConfig = createGameRecommendationConfig.sidebarRelatedGames(game.id);

  return (
    <div className="mx-auto">
      {isCompactLayout ? (
        // 5xl模式：左右布局（桌面端），移动端垂直布局
        <div className="flex flex-col xl:flex-row gap-6 lg:gap-2">
          {/* 左侧：游戏容器 + 游戏详情 */}
          <div className="flex-1 xl:max-w-5xl">
            {/* 游戏容器组件 */}
            <div className="mb-6">
              <GameContainerComponent game={gameForContainer} />
            </div>
            
            {/* 游戏详情内容 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
              {/* 面包屑导航 - 仅在非主页游戏时显示 */}
              {!isMain && (
                <div className="mb-6">
                  <Breadcrumb items={[
                    { label: 'Home', href: '/' },
                    { label: game.title, href: `/${game.id}` }
                  ]} />
                </div>
              )}
              {content && (
                <LazyMarkdownRenderer 
                  content={content} 
                  className="prose prose-lg max-w-none"
                />
              )}
            </div>

            {/* 分类区域 */}
            <div className="bg-white pb-8 mb-6 rounded-lg shadow-sm border border-gray-100">
              <Categories 
                categories={game.categories.map((cat: string) => ({
                  name: cat.toUpperCase(),
                  href: `/games/${cat.toLowerCase().replace(/\s+/g, '-')}`
                }))}
              />
            </div>

            {/* 评论区域 */}
            <div id="comments" className="bg-white pt-1 pb-8 rounded-lg shadow-sm border border-gray-100">
              <Comments
                pageTitle={game.title}
                gameId={game.id}
              />
            </div>
          </div>
          
          {/* 右侧：相关游戏推荐 */}
          <div className="w-full xl:w-96 xl:max-w-2xl xl:flex-shrink-0">
            <div className="xl:sticky xl:top-8">
              <GameRecommendationSection 
                config={sidebarRelatedGamesConfig} 
                currentGameId={game.id} 
              />
            </div>
          </div>
        </div>
      ) : (
        // 7xl模式：上下布局
        <div>
          {/* 游戏容器组件 - 页面最上方 */}
          <div className="mb-6">
            <GameContainerComponent game={gameForContainer} />
          </div>
          
          {/* 下方左右布局（桌面端），移动端垂直布局 */}
          <div className="flex flex-col xl:grid xl:grid-cols-7 gap-6 lg:gap-2">
            {/* 左侧：游戏详情 - 占 5/7 宽度 */}
            <div className="xl:col-span-5">
              {/* 游戏详情内容 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
                {/* 面包屑导航 - 仅在非主页游戏时显示 */}
                {!isMain && (
                  <div className="mb-6">
                    <Breadcrumb items={[
                      { label: 'Home', href: '/' },
                      { label: game.title, href: `/${game.id}` }
                    ]} />
                  </div>
                )}
                {content && (
                  <LazyMarkdownRenderer 
                    content={content} 
                    className="prose prose-lg max-w-none"
                  />
                )}
              </div>

              {/* 分类区域 */}
              <div className="bg-white pb-8 mb-6 rounded-lg shadow-sm border border-gray-100">
                <Categories 
                  categories={game.categories.map((cat: string) => ({
                    name: cat.toUpperCase(),
                    href: `/games/${cat.toLowerCase().replace(/\s+/g, '-')}`
                  }))}
                />
              </div>

              {/* 新游戏部分 */}
              <NewGames limit={16} showTitle={true} title="Latest New Games" />

              {/* 评论区域 */}
              <div id="comments" className="bg-white pt-1 pb-8 rounded-lg shadow-sm border border-gray-100">
                <Comments
                  pageTitle={game.title}
                  gameId={game.id}
                />
              </div>
            </div>
            
            {/* 右侧：相关游戏推荐 - 占 2/7 宽度 */}
            <div className="xl:col-span-2">
              <div className="xl:sticky xl:top-4">
                <GameRecommendationSection 
                  config={sidebarRelatedGamesConfig} 
                  currentGameId={game.id} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetail;
