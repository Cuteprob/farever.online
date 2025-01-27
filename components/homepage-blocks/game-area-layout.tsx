import { GameContainer } from "@/components/game-container"
import { GameContainer3 } from "./game-container-3"
import { Game as ProjectGame, getProjectGamesByCategoryId } from "@/models/productGames"
import { Game as ConfigGame } from "@/config/sprunkigame"

interface GameAreaLayoutProps {
  game: ConfigGame
}

export async function GameAreaLayout({ game }: GameAreaLayoutProps) {
  
  const [newGames, featuredGames] = await Promise.all([
    getProjectGamesByCategoryId('NEW'),
    getProjectGamesByCategoryId('FEATURED'),
  ])

  // 游戏卡片组件
  const GameCard = ({ game, tag }: { game: ProjectGame, tag?: string }) => (
    <div className="relative aspect-[4/3] card-base overflow-hidden group">
      <a href={`/${game.id}`} className="block w-full h-full">
        <img 
          src={game.image} 
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        {/* 悬浮时显示游戏名称 */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00a6ff]/80 to-[#b200ff]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 space-y-2 rounded-0">
          <span 
            className="text-white text-lg font-bold text-center line-clamp-2 before:content-['Play_Now']"
            aria-label="Play Now"
          />
        </div>
      
      </a>
    </div>
  )

  return (
    <div className="w-full max-w-[1400px] mx-auto">

      {/* 桌面端布局 */}
      <div className="hidden lg:block w-full max-w-[1400px] mx-auto">
        {/* 三栏布局区域 */}
        <div className="grid grid-cols-[120px_auto_240px] gap-4 mb-4">
          {/* 左侧边栏 */}
          <div className="flex flex-col gap-2 content-start h-full">
            {/* 左侧竖向广告区域 */}
           
            {/* 新游戏卡片 */}
            {newGames.slice(0, 9).map((game) => (
              <div key={game.id}>
                <GameCard game={game} tag="New" />
              </div>
            ))}
          </div>

          {/* 中间游戏区域 */}
          <div className="flex flex-col justify-between h-full">
            <div className="w-full">
              <GameContainer3 />
            </div>
            {/* 底部广告区域 */}
            <div className="aspect-[6/2] card-base overflow-hidden mt-4">
              
            </div>
          </div>

          {/* 右侧边栏 */}
          
          <div className="flex flex-col justify-between h-full">
            {/* 新游戏网格 */}
            <div className="grid grid-cols-2 gap-4">
              {newGames.slice(9, 27).map((game) => (
                <div key={game.id}>
                  <GameCard game={game} tag="New" />
                </div>
              ))}
            </div>
            {/* 广告区域 */}
            
          </div>
        </div>

        {/* 底部新游戏推荐 */}
        <div className="grid grid-cols-8 gap-4">
          {featuredGames.slice(0, 16).map((game) => (
            <div key={game.id}>
              <GameCard game={game} tag="Featured" />
            </div>
          ))}
        </div>
      </div>

      {/* 移动端布局 */}
      <div className="lg:hidden space-y-4 mt-4 px-4">
        <GameContainer3 />
        
        {/* 新游戏滚动 */}
        <div className="flex overflow-x-auto gap-3 pb-4 hide-scrollbar pl-4 pr-4">
          {newGames.map((game) => (
            <div key={game.id} className="flex-shrink-0 w-[140px] aspect-[4/3]">
              <GameCard game={game} tag="New" />
            </div>
          ))}
        </div>

        {/* 新游戏网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {newGames.slice(0, 21).map((game) => (
            <div key={game.id} className="aspect-[4/3]">
              <GameCard game={game} tag="New" />
            </div>
          ))}
        </div>

        {/* 广告区域 */}
        <div className="aspect-[4/1] card-base overflow-hidden rounded-xl" />
        
        {/* 底部新游戏滚动 */}
        <div className="flex overflow-x-auto gap-3 pb-4 hide-scrollbar pl-4 pr-4">
          {featuredGames.slice(8).map((game) => (
            <div key={game.id} className="flex-shrink-0 w-[140px] aspect-[4/3]">
              <GameCard game={game} tag="Featured" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 