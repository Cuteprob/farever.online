import React from 'react';
import { Metadata } from 'next';
import GameDetail from '@/components/game-detail';
import { StructuredData } from '@/components/structured-data';
import { GameProps } from '@/types/game';
import { getMainGame } from '@/models/games';

// 直接使用模型层的缓存机制
async function getCachedMainGame(): Promise<GameProps | null> {
  try {
    return await getMainGame();
  } catch (error) {
    console.error('Error fetching main game:', error);
    return null;
  }
}

// 创建默认元数据的工厂函数
function createDefaultMetadata(): Metadata {
  const defaultTitle = 'BunnyMarket - Play Free Online Games';
  const defaultDescription = 'Play the best free online games at BunnyMarket! Enjoy a collection of fun, engaging, and entertaining games for all ages. Start playing now!';
  const defaultImage = `${process.env.NEXT_PUBLIC_WEB_URL}/og-image.jpg`;
  
  return {
    title: defaultTitle,
    description: defaultDescription,
    keywords: [],
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      type: 'website',
      url: process.env.NEXT_PUBLIC_WEB_URL,
      siteName: 'BunnyMarket',
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: 'BunnyMarket - Free Online Games',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDescription,
      images: [defaultImage],
    },
    alternates: {
      canonical: process.env.NEXT_PUBLIC_WEB_URL,
    },
  };
}

// 基于游戏数据创建元数据的工厂函数
function createGameMetadata(game: GameProps): Metadata {
  const title = game.metadata?.title || `${game.title} - BunnyMarket`;
  const description = game.metadata?.description || `Play ${game.title} - A fun and engaging online game at BunnyMarket!`;
  const keywords = game.metadata?.keywords;
  const gameImage = game.image || `${process.env.NEXT_PUBLIC_WEB_URL}/og-image.jpg`;
  
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      url: process.env.NEXT_PUBLIC_WEB_URL,
      siteName: 'BunnyMarket',
      images: [
        {
          url: gameImage,
          width: 1200,
          height: 630,
          alt: `${game.title} - Play Free Online`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [gameImage],
    },
    alternates: {
      canonical: process.env.NEXT_PUBLIC_WEB_URL,
    },
  };
}

// 生成主页面元数据
export async function generateMetadata(): Promise<Metadata> {
  const game = await getCachedMainGame();
  
  if (!game) {
    return createDefaultMetadata();
  }
  
  return createGameMetadata(game);
}

export default async function HomePage() {
  const startTime = Date.now();
  const game = await getCachedMainGame();
  
  // 性能监控 (仅在开发环境)
  if (process.env.NODE_ENV === 'development') {
    const endTime = Date.now();
    console.log(`🚀 Main game loaded in ${endTime - startTime}ms`);
  }

  // 如果没有主游戏，显示提示信息
  if (!game) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Main Game Available</h1>
            <p className="text-gray-600">Please check back later or contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <StructuredData game={game} isMainPage={true} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <GameDetail game={game} isMain={true} />
        </div>
      </div>
    </>
  );
}


