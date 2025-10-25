// Dependencies
import { useStore } from "@/stores";
import { useMemo } from "react";

// Logic
import { createEventsLogic } from "@/logic/eventsLogic";
import { createMapLogic } from "@/logic/mapLogic";
import { createTurnLogic } from "@/logic/turnLogic";

// Hook to provide all game logic
export function useLogic() {
  // Game actions
  const game = useStore("game", "actions");

  // Memoize the creation of the logic objects
  const logic = useMemo(() => {
    const eventsLogic = createEventsLogic({
      getGame: game.getCurrent,
      updateGame: game.update,
    });

    const mapLogic = createMapLogic({
      getGame: game.getCurrent,
      updateGame: game.update,
      eventsLogic,
    });

    const turnLogic = createTurnLogic();

    return {
      ...turnLogic,
      ...eventsLogic,
      ...mapLogic,
    };
  }, []);

  return logic;
}
