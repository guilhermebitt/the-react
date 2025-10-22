// Dependencies
import { useEffect, useRef } from "react";
import { useStore } from "@/stores";

// Importing TS types
import { TurnTypes, EntityIds } from "@/types";
import { validTurns } from "@/types/constants";
import * as funcs from "@/utils/functions";
import { Enemy } from "@/utils/entities";

// Functions that handle the context dependencies
export function useTurnLogic() {
  const isFirstRender = useRef(true);
  const lastTurn = useRef<TurnTypes>(null);
  // Stores
  const playerActions = useStore("player", "actions");
  const enemiesActions = useStore("enemies", "actions");
  const game = useStore("game", s => ({currentTurn: s.game.currentTurn}));
  const gameActions = useStore("game", "actions");

  // Constantly checks if the turn changed
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // ⛔ ignores the first execution
    }

    // Keeping the lastTurn
    const lastTurnTemp: TurnTypes = lastTurn.current;

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
    switch (game.currentTurn) {
      case "player":
        functions.handlePlayerTurn();
        break;

      case "enemies":
        functions.handleEnemiesTurn();
        break;

      case null:
        // This says that there's not a entity turn
        gameActions.update({ specificEntityTurn: -1 });
        break;

      default:
        return;
    }
  }, [game.currentTurn]);

  // Functions
  const functions = {
    // Function to handle the player turn
    handlePlayerTurn() {
      // First of all, we reset the specific turn (0 is player)
      gameActions.update({ specificEntityTurn: 0 });

      // Skipping turn
      if (playerActions.getCurrent().skipTurn === true) this.handleEnemiesTurn();

      // Resetting the player actions
      playerActions.update({ actionsLeft: playerActions.getCurrent().actions });
    },

    // Function to handle the enemies turn. Starts from the enemy 1
    handleEnemiesTurn(enemyId: EntityIds = 1) {
      // First of all, sets the specific entity turn
      gameActions.update({ specificEntityTurn: enemyId });

      // Getting the entity by its id
      const enemy = enemiesActions.getCurrent(enemyId);

      // Executing its turn
      this.enemyTurn(enemy as Enemy).then(() => {
        // Getting the amount of enemies
        const enemiesAmount = (enemiesActions.getCurrent() as Enemy[]).length;

        // Setting the specific turn to the next enemy
        const nextEntity = enemyId + 1;

        // If the player died, will skip all turns
        if (playerActions.getCurrent().isDead()) {
          gameActions.update({ currentTurn: null });
          return;
        }

        // If the next entity id reaches the last enemy of the enemies list. It'll finish the enemies turn
        if (nextEntity > enemiesAmount) this.switchTurn("player");
        else this.handleEnemiesTurn(nextEntity);
      });
    },

    // Functions that changes the current turn
    switchTurn(turnToSwitch: TurnTypes = null) {
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
      gameActions.update({ currentTurn: nextTurn });
    },

    // Handling the enemy's turn
    enemyTurn(enemy: Enemy) {
      return new Promise<void>((resolve) => {
        // CODE FOR THE ENEMY'S TURN

        // Skipping turn
        if (enemy.skipTurn === true) {
          resolve();
          return;
        }

        const turn = enemy.handleTurn(playerActions.getCurrent());

        if (!turn) {
          console.error("turn is null at enemyTurn().");
          return;
        }

        // Handling the action type
        switch (turn.actionType) {
          case "attack":
            var { attackMsg, timeToWait } = turn.action;
            funcs.phrase(`${turn.msg}. ${attackMsg}`);
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
  };

  return { ...functions };
}
