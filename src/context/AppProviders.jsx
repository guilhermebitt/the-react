import { AudioProvider } from "./AudioProvider";
import { TickProvider } from "./TickProvider";
import { PlayerProvider } from "./PlayerProvider";
import { EnemiesProvider } from "./EnemiesProvider";
import { GameProvider } from "./GameProvider";
import { LogicProvider } from "./LogicProvider";

export function AppProviders({ children }) {
  return (
    <GameProvider>
      <AudioProvider>
        <TickProvider>
          <PlayerProvider>
            <EnemiesProvider>
              <LogicProvider>
                {children}
              </LogicProvider>
            </EnemiesProvider>
          </PlayerProvider>
        </TickProvider>
      </AudioProvider>
    </GameProvider>
  );
}
