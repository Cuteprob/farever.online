'use client';

import React from 'react';
import Link from 'next/link';

import { GameProps } from '@/types/game';

interface GameGridProps {
  games: GameProps[];
  className?: string;
}

const GameCard: React.FC<{ game: GameProps }> = ({ game }) => {
  return (
    <Link href={`/${game.id}`} className="group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1">
        {/* 游戏图片 */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          {game.image ? (
            <img
              src={game.image}
              alt={game.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <svg 
                className="w-16 h-16 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
            </div>
          )}
          
          {/* 评分徽章 */}
          {game.rating.totalRatings > 0 && (
            <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
              <span>{game.rating.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* 游戏信息 */}
        <div className="p-4">
          {/* 游戏标题 */}
          <h3 className="font-heading font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {game.title}
          </h3>

          {/* 分类标签 */}
          {game.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {game.categories.slice(0, 2).map((category, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium"
                >
                  {category}
                </span>
              ))}
              {game.categories.length > 2 && (
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                  +{game.categories.length - 2}
                </span>
              )}
            </div>
          )}

          {/* 游戏统计 */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-3">
              {/* 评分 */}
              {game.rating.totalRatings > 0 ? (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                  <span className="font-medium">{game.rating.averageRating.toFixed(1)}/5.0</span>
                  <span>({game.rating.totalRatings} votes)</span>
                </div>
              ) : (
                <span className="text-gray-400">No ratings yet</span>
              )}
            </div>

            {/* 播放按钮指示 */}
            <div className="flex items-center space-x-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium">Play</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const GameGrid: React.FC<GameGridProps> = ({ games, className = '' }) => {
  if (games.length === 0) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
};

export default GameGrid;
