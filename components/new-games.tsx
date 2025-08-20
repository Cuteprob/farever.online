"use client"

import { useEffect, useState } from "react"
import { GameProps } from "@/types/game"
import { GameCard } from "./game-card"

interface NewGamesProps {
  limit?: number;
  showTitle?: boolean;
  title?: string;
}

export function NewGames({ 
  limit = 16, 
  showTitle = true, 
  title = "Latest New Games" 
}: NewGamesProps) {
  const [newGames, setNewGames] = useState<GameProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 通过NEW_GAMES分类ID获取新游戏
        const response = await fetch(`/api/getGamesByCategory?categoryId=new-games&limit=${limit}&offset=0`);
        const data = await response.json();
        
        if (data.success) {
          setNewGames(data.data || []);
        } else {
          setError(data.error || 'Failed to fetch new games');
        }
      } catch (err) {
        console.error('Error fetching new games:', err);
        setError('Failed to load new games');
      } finally {
        setLoading(false);
      }
    };

    fetchNewGames();
  }, [limit]);

  return (
    <section className="py-10 my-10 max-w-5xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题部分 */}
        {showTitle && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            <p className="text-gray-600">
              Discover the newest games just added to our collection
            </p>
          </div>
        )}

        {/* 加载状态 */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-gray-600">Loading new games...</span>
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
        {!loading && !error && newGames.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                showBadge={true}
                badgeText="New"
                badgeColor="purple"
              />
            ))}
          </div>
        )}

        {/* 无新游戏状态 */}
        {!loading && !error && newGames.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No new games available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}
