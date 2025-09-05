"use client"

import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect } from "react"
import { GameProps } from "@/types/game"
import { StarRating } from "@/components/StarRating"
import LazyShareDialog from "@/components/LazyShareDialog"

interface GameContainerProps {
  game: GameProps;
}

export function GameContainer({ game }: GameContainerProps) {
  const [error, setError] = useState(false);
  const [currentRating, setCurrentRating] = useState(game.rating);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 增强版全局评分更新监听 - 实时同步与缓存清理
  useEffect(() => {
    // 挂载时主动拉取最新评分，避免SSR数据陈旧
    const fetchLatestRating = async () => {
      try {
        const res = await fetch(`/api/games/rating?gameId=${game.id}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.success && data.data) {
            setCurrentRating({
              averageRating: data.data.averageRating,
              totalRatings: data.data.totalRatings
            });
          }
        }
      } catch (e) {
        // 忽略错误，保留SSR数据
      }
    };
    fetchLatestRating();

    const handleRatingUpdate = (event: CustomEvent) => {
      const { gameId, averageRating, totalRatings, timestamp } = event.detail;
      
      // 只更新当前游戏的评分
      if (gameId === game.id) {
        console.log(`Game ${gameId} rating updated:`, { averageRating, totalRatings, timestamp });
        setCurrentRating({
          averageRating,
          totalRatings
        });
      }
    };

    const handleCacheInvalidate = (event: CustomEvent) => {
      const { gameId } = event.detail;
      
      // 如果是当前游戏，强制重新加载评分数据
      if (gameId === game.id) {
        console.log(`Cache invalidated for game ${gameId}, reloading rating...`);
        fetchLatestRating();
      }
    };

    window.addEventListener('ratingUpdated', handleRatingUpdate as EventListener);
    window.addEventListener('invalidateCache', handleCacheInvalidate as EventListener);
    
    return () => {
      window.removeEventListener('ratingUpdated', handleRatingUpdate as EventListener);
      window.removeEventListener('invalidateCache', handleCacheInvalidate as EventListener);
    };
  }, [game.id]);

  const enterFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  // 处理评分变化
  const handleRatingChange = (newAverageRating: number, newTotalRatings: number) => {
    setCurrentRating({
      averageRating: newAverageRating,
      totalRatings: newTotalRatings
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto h-96 sm:h-[500px] md:h-[600px] flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden">
      
      {/* 游戏区域 */}
      <div className="flex-1 relative">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-sm z-10">
            <p className="text-white mb-4 text-center">Failed to load game. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        ) : null}

        <iframe 
          ref={iframeRef}
          src={game.iframeUrl}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen={true}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-top-navigation-by-user-activation"
          referrerPolicy="no-referrer"
          loading="lazy"
          title={`${game.title} - Online Game`}
        />
      </div>

      {/* 底部控制栏 */}
      <div className="bg-gray-800/90 backdrop-blur-sm border-t border-gray-700 px-4 py-3 flex items-center justify-between">
        {/* 左侧游戏信息 */}
        <div className="flex items-center space-x-3 min-w-0 flex-1 mr-4">
          {/* 游戏名称 */}
          <h1 className="text-white font-medium text-sm sm:text-base truncate">{game.title}</h1>
          {/* 分隔符 */}
          <div className="text-helper text-sm">|</div>
          {/* 评分组件 */}
          <div className="flex-shrink-0">
            <StarRating
              gameId={game.id}
              averageRating={currentRating.averageRating}
              totalRatings={currentRating.totalRatings}
              onRatingChange={handleRatingChange}
              size="sm"
              showDetails={true}
            />
          </div>
        </div>

        {/* 右侧控制按钮 */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* 分享按钮 */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsShareDialogOpen(true)}
            className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-white/10 rounded-full"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </Button>

          {/* 评论按钮 */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              const commentsSection = document.getElementById('comments');
              if (commentsSection) {
                commentsSection.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            }}
            className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-white/10 rounded-full"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </Button>

          {/* 全屏按钮 */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={enterFullscreen}
            className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-white/10 rounded-full"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </Button>
        </div>
      </div>

      {/* 分享对话框 - 懒加载版本 */}
      <LazyShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        gameTitle={game.title}
      />
    </div>
  );
} 