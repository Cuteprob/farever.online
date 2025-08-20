'use client';

import React from 'react';
import { GameDetailProps, GameProps } from '@/types/game';
import LazyMarkdownRenderer from '@/components/LazyMarkdownRenderer';
import { GameContainer } from '@/components/game-container';
import { Comments } from './comments';
import { RelatedGames } from './related-games';
import { Categories } from './categories';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { NewGames } from './new-games';

const GameDetail: React.FC<GameDetailProps> = ({ game, isMain = false }) => {
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

  return (
    <div className="max-w-5xl mx-auto">     
      {/* 游戏容器组件 - 页面最上方 */}
      <div className="mb-8">
        <GameContainer game={gameForContainer} />
      </div>
      <RelatedGames currentGameId={game.id} />
      {/* Markdown 内容区域 */}
      <div className="bg-white rounded-lg p-8 shadow-sm border mb-8">
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

      <div className="bg-white pb-8 mb-4 rounded-lg shadow-sm border border-gray-100">
        <Categories 
        categories={game.categories.map(cat => ({
          name: cat.toUpperCase(),
          href: `/games/${cat.toLowerCase().replace(/\s+/g, '-')}`
        }))}/>
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
  );
};

export default GameDetail;
