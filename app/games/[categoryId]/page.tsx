import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllGames, getCategoryBySlug, getAllCategories } from '@/models/games';
import { GameProps } from '@/types/game';
import GameGrid from '@/components/GameGrid';
import { Categories } from '@/components/categories';
import { Breadcrumb } from '@/components/ui/breadcrumb';
export const runtime = 'edge';
interface CategoryPageProps {
  params: {
    categoryId: string;
  };
  searchParams: {
    page?: string;
  };
}

// 生成页面元数据
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.categoryId);
  
  if (!category) {
    return {
      title: 'Category Not Found | BunnyMarket Games',
      description: 'The requested game category could not be found.'
    };
  }

  return {
    title: `${category.name} | BunnyMarket Games`,
    description: category.description || `Explore our collection of ${category.name.toLowerCase()}.`,
    openGraph: {
      title: `${category.name} Games`,
      description: category.description || `Explore our collection of ${category.name.toLowerCase()}.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} Games`,
      description: category.description || `Explore our collection of ${category.name.toLowerCase()}.`,
    }
  };
}

// 获取分类游戏数据
async function getCategoryGames(categorySlug: string, page: number = 1): Promise<{
  games: GameProps[];
  hasMore: boolean;
  total: number;
}> {
  try {
    const limit = 12; // 每页12个游戏 (3x4网格)
    const offset = (page - 1) * limit;
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/getGamesByCategory?categoryId=${categorySlug}&limit=${limit}&offset=${offset}`);
    const data = await response.json();
    const games = data.data;

    // 获取分类信息
    const category = await getCategoryBySlug(categorySlug);
    if (!category) {
      return { games: [], hasMore: false, total: 0 };
    }
    const hasMore = games.length > limit;
    const actualGames = hasMore ? games.slice(0, limit) : games;

    return {
      games: actualGames,
      hasMore,
      total: actualGames.length
    };
  } catch (error) {
    console.error('Error fetching category games:', error);
    return { games: [], hasMore: false, total: 0 };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // 获取分类信息
  const category = await getCategoryBySlug(params.categoryId);
  
  if (!category) {
    notFound();
  }

  const page = parseInt(searchParams.page || '1');
  const { games, hasMore, total } = await getCategoryGames(params.categoryId, page);
  
  // 获取所有分类用于导航
  const allCategories = await getAllCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <div className="mb-6">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: category.name, href: `/games/${params.categoryId}` }
          ]} />
        </div>

        {/* 简化的页面头部 */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-gray-600 mb-4">
              {category.description}
            </p>
          )}
        </div>

        {/* 游戏网格 */}
        {games.length > 0 ? (
          <>
            <GameGrid games={games} className="mb-16" />
            
            {/* 优化的分页控制 */}
            {(page > 1 || hasMore) && (
              <div className="mt-12 flex items-center justify-center space-x-6">
                {page > 1 && (
                  <a
                    href={page === 2 ? `/games/${params.categoryId}` : `/games/${params.categoryId}?page=${page - 1}`}
                    className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </a>
                )}
                
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-2 text-gray-600 font-medium">
                    Page {page}
                  </span>
                  {total > 0 && (
                    <span className="text-gray-400 text-sm">
                      ({total} games)
                    </span>
                  )}
                </div>
                
                {hasMore && (
                  <a
                    href={`/games/${params.categoryId}?page=${page + 1}`}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Next
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </>
        ) : (
          /* 简化的空状态 */
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No games found
            </h3>
            <p className="text-gray-600 mb-4">
              This category doesn't have any games yet.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Play Bunny Market
            </a>
          </div>
        )}
                {/* 分类导航 */}
                {allCategories.length > 0 && (
          <div className="my-8">
            <Categories categories={allCategories.map(cat => ({
              name: cat.name,
              href: `/games/${cat.slug}`,
              count: cat.gameCount
            }))} />
          </div>
        )}
      </div>
    </div>
  );
}