// Importing TS types
import { GameData, GameUpdater, TurnTypes } from "@/types";
import { validTurns } from "@/types/constants";

// Interface for the deps
export interface TurnLogicDeps {
  getGame: () => GameData;
  updateGame: GameUpdater;
}

// Functions that handle the context dependencies
export function createTurnLogic(deps: TurnLogicDeps) {
  const { getGame, updateGame } = deps;

  return {
    // Functions that changes the current turn
    switchTurn(turnToSwitch: TurnTypes = null) {
      const game = getGame();
      // Saving the variable locally
      let nextTurn = turnToSwitch;

      // Verifying if the currentTurn is switchable
      if (!validTurns.includes(game.currentTurn)) {
        return console.warn("⚠️ At switchTurn function: the current turn is not switchable.");
      }

      // Switching the current turn
      if (!nextTurn) {
        nextTurn =
          game.currentTurn === "player"
            ? "enemies" // If the current turn is "player", the next is "enemies"
            : "player"; // Same thing from above
      }

      // Defining the next turn
      updateGame({ currentTurn: nextTurn });
    },
  };
}
