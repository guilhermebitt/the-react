import { AudioProvider } from "./AudioProvider";
import { TickProvider } from "./TickProvider";
import { PlayerProvider } from "./PlayerProvider";
import { EnemiesProvider } from "./EnemiesProvider";
import { GameProvider } from "./GameProvider";



export function AppProviders({ children }) {
  return (
    <GameProvider>
      <AudioProvider>
        <TickProvider>
          <PlayerProvider>
            <EnemiesProvider>
              {children}
            </EnemiesProvider>
          </PlayerProvider>
        </TickProvider>
      </AudioProvider>
    </GameProvider>
  );
}
