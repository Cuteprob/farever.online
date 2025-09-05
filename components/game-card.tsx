import Link from "next/link"
import { GameProps } from "@/types/game"

interface GameCardProps {
  game: GameProps;
  badgeText?: string;
  badgeColor?: 'green' | 'red' | 'blue' | 'purple';
  showBadge?: boolean;
}

export function GameCard({ 
  game, 
  badgeText,
  badgeColor = 'green',
  showBadge = false 
}: GameCardProps) {
  const getBadgeClasses = (color: string) => {
    const baseClasses = "absolute top-theme-sm right-theme-sm px-theme-sm py-theme-xs text-white text-theme-xs font-theme-body font-medium rounded-full";
    
    switch (color) {
      case 'green':
        return `${baseClasses} bg-theme-neon-500`;
      case 'red':
        return `${baseClasses} bg-theme-fire-500`;
      case 'blue':
        return `${baseClasses} bg-theme-ocean-500`;
      case 'purple':
        return `${baseClasses} bg-theme-neon-600`;
      default:
        return `${baseClasses} bg-theme-neon-500`;
    }
  };

  return (
    <Link
      href={`/${game.id}`}
      className="group block"
    >
      <div className="bg-theme-dark-800 rounded-xl shadow-neon overflow-hidden transition-all border border-theme-dark-600 hover:shadow-game-hover">
        {/* 游戏图片 */}
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* 可选的标签 */}
          {showBadge && badgeText && (
            <div className={getBadgeClasses(badgeColor)}>
              {badgeText}
            </div>
          )}
        </div>
        
        {/* 游戏信息 */}
        <div className="p-theme-md text-center">
          <h3 className="font-theme-heading font-bold text-primary text-theme-sm mb-theme-xs truncate group-hover:text-theme-fire-500 transition-colors">
            {game.title}
          </h3>
          <p className="text-secondary text-theme-xs mb-theme-md">
            {game.categories.length > 0 ? game.categories.join(' • ') : ''}
          </p>
          
          {/* 播放按钮 */}
          <button className="w-full px-theme-md py-theme-sm bg-gradient-fire text-white text-theme-sm font-theme-body font-medium rounded-lg hover:from-theme-fire-600 hover:to-red-600 transition-all shadow-speed">
            Play
          </button>
        </div>
      </div>
    </Link>
  )
}
