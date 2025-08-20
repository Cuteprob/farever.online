"use client"

import Link from "next/link"
import { useEffect, useState, useRef, useCallback } from "react"
import { GameProps } from "@/types/game"

interface RelatedGamesProps {
  currentGameId?: string;
}

export function RelatedGames({ currentGameId }: RelatedGamesProps) {
  const [relatedGames, setRelatedGames] = useState<GameProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      {
        rootMargin: '100px', // 提前100px开始加载
        threshold: 0.1
      }
    );

    const currentRef = componentRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isVisible]);

  const fetchRelatedGames = useCallback(async () => {
    if (!currentGameId || !isVisible) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/getRelatedGames?gameId=${currentGameId}&limit=16`);
      const data = await response.json();
      
      if (data.success) {
        setRelatedGames(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch related games');
      }
    } catch (err) {
      console.error('Error fetching related games:', err);
      setError('Failed to load related games');
    } finally {
      setLoading(false);
    }
  }, [currentGameId, isVisible]);

  useEffect(() => {
    fetchRelatedGames();
  }, [fetchRelatedGames]);

  return (
    <section ref={componentRef} className="py-10 my-10 max-w-5xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题部分 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Other Games You Might Like
          </h2>
        </div>

        {/* 加载状态 */}
        {!isVisible ? (
          <div className="flex justify-center items-center py-8">
            <div className="h-8 w-8 border-b-2 border-gray-300 rounded-full"></div>
            <span className="ml-2 text-gray-600">Related games will load when visible...</span>
          </div>
        ) : loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-gray-600">Loading related games...</span>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* 4x4 游戏网格 */}
        {!loading && !error && relatedGames.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedGames.map((game) => (
              <Link
                key={game.id}
                href={`/${game.id}`}
                className="group block"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all">
                  {/* 游戏图片 */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* 游戏信息 */}
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-gray-500 text-xs mb-3">
                      {game.categories.includes('New Games') ? 'New Games' : 
                       game.categories.includes('Hot Games') ? 'Popular Games' : 
                       game.categories.length > 0 ? game.categories[0] : 'Guessing Games'}
                    </p>
                    
                    {/* 播放按钮 */}
                    <button className="w-full px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-lg group-hover:bg-primary group-hover:text-white transition-colors border border-gray-300 group-hover:border-primary">
                      Play
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 无相关游戏状态 */}
        {!loading && !error && relatedGames.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No related games found.</p>
          </div>
        )}
      </div>
    </section>
  )
}