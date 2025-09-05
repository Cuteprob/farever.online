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
      <div className="bg-theme-dark-800 rounded-xl shadow-neon border border-theme-dark-600 overflow-hidden transition-all duration-300 hover:shadow-game-hover hover:border-theme-fire-500/50 hover:-translate-y-1">
        {/* 游戏图片 */}
        <div className="relative aspect-video overflow-hidden bg-theme-dark-700">
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
                className="w-16 h-16 text-text-muted" 
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
          
            <div className="absolute top-theme-md right-theme-md bg-black/70 text-white px-theme-sm py-theme-xs rounded-full text-theme-xs font-heading font-medium flex items-center space-x-1">
              <svg className="w-3 h-3 fill-yellow-300 " viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
              <span className="font-theme-body">{game.rating.averageRating.toFixed(1)}</span>
            </div>
          )
        </div>

        {/* 游戏信息 */}
        <div className="p-theme-md">
          {/* 游戏标题 */}
          <h3 className="font-theme-heading font-semibold text-primary mb-theme-sm truncate group-hover:text-theme-fire-500 transition-colors">
            {game.title}
          </h3>

          {/* 分类标签 */}
          {game.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-theme-md">
              {game.categories.slice(0, 2).map((category, index) => (
                <span
                  key={index}
                  className="inline-block px-theme-sm py-theme-xs bg-theme-dark-700 text-secondary text-theme-xs rounded-full font-theme-body font-medium"
                >
                  {category}
                </span>
              ))}
              {game.categories.length > 2 && (
                <span className="inline-block px-theme-sm py-theme-xs bg-theme-dark-700 text-secondary text-theme-xs rounded-full font-theme-body font-medium">
                  +{game.categories.length - 2}
                </span>
              )}
            </div>
          )}


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
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-theme-lg ${className}`}>
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
};

export default GameGrid;
