import { AudioProvider } from "./AudioProvider";
import { TickProvider } from "./TickProvider";

export function AppProviders({ children }) {
  return (
    <AudioProvider>
      <TickProvider>
        {children}
      </TickProvider>
    </AudioProvider>
  );
}