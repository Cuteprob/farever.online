"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRef, useState } from "react"
import { Icons } from "@/config/icons"
import { Game } from "@/config/sprunkigame"

interface GameContainerProps {
  game: Game;
}

export function GameContainer({ game }: GameContainerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const enterFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  const handleIframeError = () => {
    setError(true);
  };

  return (
    <div className="aspect-video w-full relative rounded-2xl bg-card/80 backdrop-blur-sm border border-border p-2 sm:p-4">
      {!isPlaying ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/80 backdrop-blur-sm rounded-2xl z-10">
          {/* 图片容器 */}
          <div className="relative group">
            {/* 背景光效 */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/60 to-accent/60 blur-lg animate-pulse" />
            </div>
            
            {/* 游戏图片 */}
            <img
              src={game.image}
              alt={game.title}
              className="relative w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-xl mb-3 
              shadow-game hover:scale-110 transition-transform duration-300 z-10"
            />
          </div>

          {/* 游戏标题 */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-heading text-foreground mb-3 sm:mb-4 md:mb-6 text-center px-2 sm:px-4">
            {game.title}
          </h2>

          {/* 游戏按钮 */}
          <button
            onClick={() => setIsPlaying(true)}
            className="relative px-4 sm:px-6 md:px-8 py-2 md:py-3 text-sm md:text-base font-heading 
            text-primary-foreground bg-primary hover:bg-primary/90 
            rounded-full transition-all duration-300 shadow-game
            hover:shadow-game-hover hover:scale-105 sm:hover:scale-110 md:hover:scale-125 
            border border-border
            animate-pulse delay-500 hover:animate-none
            active:scale-95"
          >
            Play Now
          </button>
        </div>
      ) : null}

      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/80 backdrop-blur-sm rounded-2xl z-10">
          <p className="text-sm text-destructive">Failed to load game. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      ) : null}

<iframe 
  ref={iframeRef}
  src={game.iframeUrl}
  className="iframe-loading w-full h-full"
  frameBorder="0"
  allowFullScreen={true}
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
/>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mt-2 sm:mt-4">
        <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
          {game.controls?.fullscreenTip}
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={enterFullscreen}
            className="h-8 w-8 sm:h-10 sm:w-10 bg-background hover:bg-muted border-border text-foreground hover:text-primary"
          >         
            {Icons.fullscreen}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10 bg-background hover:bg-muted border-border text-foreground hover:text-primary"
              >
                {Icons.help}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px] sm:w-80 bg-card/95 border border-border rounded-2xl p-0">
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                <div>
                  <h3 className="font-heading text-primary text-xs sm:text-sm mb-1.5 sm:mb-2">Movement Controls</h3>
                  <ul className="space-y-0.5 sm:space-y-1">
                    {game.controls?.guide?.movement?.map((control, index) => (
                      <li key={index} className="text-xs sm:text-sm text-muted-foreground">{control}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-heading text-primary text-xs sm:text-sm mb-1.5 sm:mb-2">Game Actions</h3>
                  <ul className="space-y-0.5 sm:space-y-1">
                    {game.controls?.guide?.actions?.map((action, index) => (
                      <li key={index} className="text-xs sm:text-sm text-muted-foreground">{action}</li>
                    ))}
                  </ul>
                </div>
                {game.controls?.guide?.special && (
                  <div>
                    <h3 className="font-heading text-primary text-xs sm:text-sm mb-1.5 sm:mb-2">Special Controls</h3>
                    <ul className="space-y-0.5 sm:space-y-1">
                      {game.controls?.guide?.special?.map((special, index) => (
                        <li key={index} className="text-xs sm:text-sm text-muted-foreground">{special}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
} 