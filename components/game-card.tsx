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
    const baseClasses = "absolute top-2 right-2 px-2 py-1 text-white text-xs font-medium rounded-full";
    
    switch (color) {
      case 'green':
        return `${baseClasses} bg-green-500`;
      case 'red':
        return `${baseClasses} bg-red-500`;
      case 'blue':
        return `${baseClasses} bg-blue-500`;
      case 'purple':
        return `${baseClasses} bg-purple-500`;
      default:
        return `${baseClasses} bg-green-500`;
    }
  };

  return (
    <Link
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
          
          {/* 可选的标签 */}
          {showBadge && badgeText && (
            <div className={getBadgeClasses(badgeColor)}>
              {badgeText}
            </div>
          )}
        </div>
        
        {/* 游戏信息 */}
        <div className="p-4 text-center">
          <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {game.title}
          </h3>
          <p className="text-gray-500 text-xs mb-3">
            {game.categories.length > 0 ? game.categories.join(' • ') : ''}
          </p>
          
          {/* 播放按钮 */}
          <button className="w-full px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-lg group-hover:bg-primary group-hover:text-white transition-colors border border-gray-300 group-hover:border-primary">
            Play
          </button>
        </div>
      </div>
    </Link>
  )
}
