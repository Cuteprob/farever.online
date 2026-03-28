import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GameDetail from '@/components/game-detail';
import { StructuredData } from '@/components/structured-data';
import { GameProps } from '@/types/game';
import { getGameById } from '@/models/games';
import { unstable_noStore as noStore } from 'next/cache';
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface GamePageProps {
  params: {
    id: string;
  };
}

// 生成游戏详情页面元数据
export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const game = await getGameById(params.id);
  
  if (!game) {
    return {
      title: `Game Not Found | ${process.env.PROJECT_NAME}`,
      description: `The requested game could not be found. Explore other games at ${process.env.PROJECT_NAME}.`,
      robots: 'noindex',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || '';
  const gameUrl = `${baseUrl}/${params.id}`;
  const metadataTitle = game.metadata?.title;
  const metadataDescription = game.metadata?.description;
  const metadataKeywords = game.metadata?.keywords;
  
  // 生成游戏评分的结构化数据
  const ratingValue = game.rating?.averageRating || 0;
  const ratingCount = game.rating?.totalRatings || 0;
  
  return {
    title: metadataTitle,
    description: metadataDescription,
    keywords: [
      ...metadataKeywords
    ],
    robots: {
      index: true,
      follow: true,
      noarchive: true,
      nosnippet: false,
      noimageindex: false,
      nocache: true,
    },
    openGraph: {
      title: metadataTitle,
      description: metadataDescription,
      type: 'article',
      url: gameUrl,
      siteName: process.env.PROJECT_NAME,
      images: [
        {
          url: game.image || `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${game.title} - Free Online Game`,
        },
      ],
      publishedTime: game.createdAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: metadataTitle,
      description: metadataDescription,
      images: [game.image || `${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: gameUrl,
    },
    other: {
      // 添加游戏相关的结构化数据
      'game:rating': ratingValue.toString(),
      'game:rating_count': ratingCount.toString(),
      'game:category': 'online game',
      'game:platform': 'web browser',
    },
  };
}

// 获取游戏详情数据 - 参考主页面数据获取流程，针对Cloudflare Pages优化
async function getGameDetailData(gameId: string): Promise<GameProps | null> {
  noStore();

  try {
    const startTime = Date.now();
    const game = await getGameById(gameId);
    const endTime = Date.now();
    
    // 性能监控 (仅在开发环境)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Game detail loaded in ${endTime - startTime}ms for gameId: ${gameId}`);
    }
    
    return game;
  } catch (error) {
    console.error(`Failed to load game detail for gameId: ${gameId}`, error);
    // 返回null而不是抛出错误，保证页面能正常渲染
    return null;
  }
}

export default async function GamePage({ params }: GamePageProps) {
  const game = await getGameDetailData(params.id);

  // 如果没有找到游戏，显示404页面
  if (!game) {
    notFound();
  }

  return (
    <>
      <StructuredData game={game} />
      <div className="container-page py-theme-xl">
        <div className="max-w-7xl mx-auto px-theme-md sm:px-theme-lg lg:px-0">
          <GameDetail game={game} isMain={false} containerSize="5xl" />
        </div>
      </div>
    </>
  );
}

