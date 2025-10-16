// Dependencies
import { useEffect, useRef } from "react";
import { useGame } from "@/hooks";

// Importing TS types
import { TurnTypes } from "@/types";
import { validTurns } from "@/types/constants";
import { init, phrase } from "@/utils/functions";
import { Enemy, Entity } from "@/utils/entities";

// Functions that handle the context dependencies
export function useTurnLogic() {
  const { game, enemies } = useGame();
  const isFirstRender = useRef(true);
  const lastTurn = useRef<TurnTypes>(null);

  // Constantly checks if the turn changed
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // ⛔ ignores the first execution
    }

    // Keeping the lastTurn
    const lastTurnTemp: TurnTypes = lastTurn.current

    // Updates the last turn to the actual one
    lastTurn.current = game.currentTurn;

    // Verifying if the last turn was onAction.
    // If the last turn was onAction, that means that
    // the entity is just going back to its turn, but
    // it don't need to executes the logic to the start
    // of the turn.
    if (lastTurnTemp === "onAction") {
      return;
    }

    // Verify what kind of turn it is
    switch(game.get().currentTurn) {
      case "player":
        functions.handlePlayerTurn()
        break;

      case "enemies":
        functions.handleEnemiesTurn()
        break;

      default:
        return;
    }
  }, [game.get().currentTurn]);

  // Initializing functions
  init(game.get());

  // Functions
  const functions = {
    // Function to handle the player turn
    handlePlayerTurn() {
      // First of all, we reset the specific turn (0 is player)
      game.update({ specificEnemyTurn: 0 });
    },

    // FUnction to handle the enemies turn
    handleEnemiesTurn() {
      // First of all, we set the specific turn to enemy 1
      let nextSpecificTurn = game.get().specificEnemyTurn + 1;
      game.update({ specificEnemyTurn: nextSpecificTurn });

      // getting the entity by its id
      const enemy = enemies.get(nextSpecificTurn);
    },

    // Functions that changes the current turn
    switchTurn(turnToSwitch: TurnTypes = null) {
      // Saving the variable locally
      let nextTurn = turnToSwitch;

      // Verifying if the currentTurn is switchable
      if (!validTurns.includes(game.get().currentTurn)) {
        return console.warn("⚠️ At switchTurn function: the current turn is not switchable.");
      }

      // Switching the current turn
      if (!nextTurn) {
        nextTurn =
          game.get().currentTurn === "player"
            ? "enemies" // If the current turn is "player", the next is "enemies"
            : "player"; // Same thing from above
      }

      // Defining the next turn
      game.update({ currentTurn: nextTurn });
    },

    // Handling the enemy's turn
    enemyTurn(enemy: Enemy, target: Entity) {
      return new Promise<void>((resolve) => {
        // CODE FOR THE ENEMY'S TURN
        const turn = enemy.handleTurn(target);

        if (!turn) {
          console.error('turn is null at enemyTurn().');
          return;
        };

        // Handling the action type
        switch (turn.actionType) {
          case "attack":
            var { attackMsg, timeToWait } = turn.action;
            phrase(`${turn.msg}. ${attackMsg}`);
            break;

          default:
            break;
        }

        // Timer to skip the current enemy turn
        const timer = setTimeout(() => {
          resolve(); // resolving the promise!
          clearTimeout(timer);
        }, timeToWait + 500); // more 0.5s to the enemy's actions
      });
    },
  }

  return {...functions};
}
