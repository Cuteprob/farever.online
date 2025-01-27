import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { games } from "@/config/homepage-games";
import { GameContainer } from "@/components/game-container";

export function GameContainer3() {
  return (
    <div id="game" className="w-full flex justify-center">
      <div className="w-full max-w-4xl">
        <Tabs defaultValue={games[0].id} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 p-1 bg-card/0 backdrop-blur-sm rounded-2xl">
                  {games.map((game) => (
                    <TabsTrigger 
                      key={game.id} 
                      value={game.id} 
                      className="relative px-4 py-3 font-heading text-lg md:text-xl font-semibold
                      text-foreground/80 bg-card/40
                      rounded-xl transition-all duration-300 
                      hover:text-primary hover:bg-card/60
                      data-[state=active]:text-primary data-[state=active]:bg-background
                      data-[state=active]:shadow-game data-[state=active]:scale-105
                      data-[state=active]:border data-[state=active]:border-border
                      hover:shadow-game hover:scale-105
                      data-[state=active]:after:content-[''] data-[state=active]:after:absolute 
                      data-[state=active]:after:bottom-[-2px] data-[state=active]:after:left-0 
                      data-[state=active]:after:w-full data-[state=active]:after:h-[2px]
                      data-[state=active]:after:bg-gradient-to-r data-[state=active]:after:from-[#00a6ff] 
                      data-[state=active]:after:to-[#b200ff] data-[state=active]:after:rounded-full
                      data-[state=active]:after:animate-pulse"
                    >
                      {game.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {games.map((game) => (
                  <TabsContent key={game.id} value={game.id}>
                    <GameContainer game={game} />
                  </TabsContent>
                ))}
        </Tabs>
      </div>
    </div>
  )
}