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
  
  // 处理 new-games 的特殊情况
  let displayCategory = category;
  if (!category && params.categoryId === 'new-games') {
    displayCategory = {
      id: 'new-games',
      name: 'New Games',
      description: 'Discover the latest and most exciting games.',
      slug: 'new-games'
    };
  }
  
  if (!displayCategory) {
    return {
      title: `Category Not Found | ${process.env.PROJECT_NAME} Games`,
      description: 'The requested game category could not be found.'
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || '';
  const categoryUrl = `${baseUrl}/games/${params.categoryId}`;

  return {
    title: `Play More ${displayCategory.name} at ${process.env.PROJECT_NAME} Games`,
    description: displayCategory.description || `Explore our collection of ${displayCategory.name.toLowerCase()}.`,
    openGraph: {
      title: `${displayCategory.name} Games`,
      description: displayCategory.description || `Explore our collection of ${displayCategory.name.toLowerCase()}.`,
      type: 'website',
      url: categoryUrl,
      siteName: process.env.PROJECT_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayCategory.name} Games`,
      description: displayCategory.description || `Explore our collection of ${displayCategory.name.toLowerCase()}.`,
    },
    alternates: {
      canonical: categoryUrl,
    },
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
    
    // 先验证分类是否存在
    const category = await getCategoryBySlug(categorySlug);
    
    let games: GameProps[];
    
    if (!category) {
      console.log(`Category not found for slug: ${categorySlug}`);
      
      // 如果是 new-games 且分类不存在，返回最新游戏
      if (categorySlug === 'new-games') {
        console.log('Fetching latest games as fallback for new-games');
        games = await getAllGames({
          limit: limit + 1,
          offset
        });
      } else {
        return { games: [], hasMore: false, total: 0 };
      }
    } else {
      // 正常通过分类ID获取游戏
      games = await getAllGames({
        categoryId: category.id,
        limit: limit + 1,
        offset
      });
    }

    const hasMore = games.length > limit;
    const actualGames = hasMore ? games.slice(0, limit) : games;

    console.log(`getCategoryGames: categorySlug=${categorySlug}, categoryId=${category?.id || 'fallback'}, returned ${actualGames.length} games, hasMore=${hasMore}`);

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
  
  // 特殊处理：如果是 new-games 且找不到分类，创建默认分类信息
  let displayCategory = category;
  if (!category && params.categoryId === 'new-games') {
    displayCategory = {
      id: 'new-games',
      name: 'New Games',
      description: 'Discover the latest and most exciting games.',
      slug: 'new-games'
    };
  } else if (!category) {
    notFound();
  }

  const page = parseInt(searchParams.page || '1');
  const { games, hasMore, total } = await getCategoryGames(params.categoryId, page);
  
  // 获取所有分类用于导航
  const allCategories = await getAllCategories();

  return (
    <div className="container-page">
      <div className="container-content">
        {/* 面包屑导航 */}
        <div className="mb-theme-lg">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: displayCategory!.name, href: `/games/${params.categoryId}` }
          ]} />
        </div>

        {/* 简化的页面头部 */}
        <div className="text-center mb-theme-6xl">
          <h1 className="heading-page">
            {displayCategory!.name}
          </h1>
          {displayCategory!.description && (
            <p className="text-content mb-theme-md">
              {displayCategory!.description}
            </p>
          )}
        </div>

        {/* 游戏网格 */}
        {games.length > 0 ? (
          <>
            <GameGrid games={games} className="mb-theme-6xl" />
            
            {/* 优化的分页控制 */}
            {(page > 1 || hasMore) && (
              <div className="pagination">
                {page > 1 && (
                  <a
                    href={page === 2 ? `/games/${params.categoryId}` : `/games/${params.categoryId}?page=${page - 1}`}
                    className="pagination-button"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </a>
                )}
                
                <div className="flex-center space-x-theme-sm">
                  <span className="pagination-current">
                    Page {page}
                  </span>
                  {total > 0 && (
                    <span className="text-helper">
                      ({total} games)
                    </span>
                  )}
                </div>
                
                {hasMore && (
                  <a
                    href={`/games/${params.categoryId}?page=${page + 1}`}
                    className="btn-primary"
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
          <div className="empty-state">
            <h3 className="empty-state-title">
              No games found
            </h3>
            <p className="empty-state-description">
              This category doesn't have any games yet.
            </p>
            <a
              href="/"
              className="btn-primary"
            >
              Play {process.env.PROJECT_NAME}
            </a>
          </div>
        )}
                {/* 分类导航 */}
                {allCategories.length > 0 && (
          <div className="my-theme-xl">
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