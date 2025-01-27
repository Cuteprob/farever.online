import { Game, games, GameCategory,  } from "@/config/sprunkigame"
import Link from "next/link"
import { FallbackImage } from "@/components/ui/fallback-image"
import { getProjectGamesByCategoryId } from "@/models/productGames";

interface GamesSidebarProps {
  limit?: number;
}

export async function GamesSidebar({ limit = 9 }: GamesSidebarProps) {

  // 直接按创建时间排序所有游戏
 
  const hotGames = await getProjectGamesByCategoryId('HOT')


  return (
    <aside className="w-full space-y-6 md:px-4">
      {/* 游戏列表 - 5列3行网格布局 */}
      <div className="grid grid-cols-3 gap-4">
        {hotGames.slice(0, limit).map((game) => (
          <Link 
            key={game.id}
            href={`/${game.id}`}
            className="group block"
          >
            <div className="bg-card/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-border overflow-hidden transition-all hover:shadow-game">
              <div className="relative">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <FallbackImage
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] md:group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-sm font-medium bg-red-500 text-primary-foreground rounded-full">
                    Hot
                  </div>
                </div>

                <div className="relative h-[50px] md:h-[60px]">
                  <div className="absolute inset-x-0 p-2 md:p-3 bg-card/95">
                    <h3 className="font-heading text-foreground text-xs md:text-sm text-center line-clamp-2 md:line-clamp-1">
                      {game.title}
                    </h3>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-2 md:p-3 bg-card/95 transition-transform duration-300 ease-out translate-y-full group-hover:translate-y-0">
                    <div className="flex justify-center">
                      <div className="inline-flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1 md:py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-xs md:text-sm font-medium shadow-sm transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 md:w-4 md:h-4">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                        Play Now
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  )
} 