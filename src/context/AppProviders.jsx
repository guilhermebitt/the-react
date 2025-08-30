import { AudioProvider } from "./AudioProvider";
import { TickProvider } from "./TickProvider";
import { PlayerProvider } from "./PlayerProvider";
import { EnemiesProvider } from "./EnemiesProvider";

export function AppProviders({ children }) {
  return (
    <AudioProvider>
      <TickProvider>
        <PlayerProvider>
          <EnemiesProvider>
            {children}
          </EnemiesProvider>
        </PlayerProvider>
      </TickProvider>
    </AudioProvider>
  );
}
