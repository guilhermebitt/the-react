// Dependencies
import { useGameStore, useEnemiesStore, usePlayerStore } from "@/stores";

// Importing TS types
import { TurnTypes, EntityIds } from "@/types";
import { validTurns } from "@/types/constants";
import * as funcs from "@/utils/functions";
import { Enemy } from "@/utils/entities";

// Functions that handle the context dependencies
export function createTurnLogic() {
  // Stores
  const player = usePlayerStore.getState();
  const enemies = useEnemiesStore.getState();
  const game = useGameStore.getState();

  // Functions
  return {
    // Function to handle the player turn
    handlePlayerTurn() {
      // First of all, we reset the specific turn (0 is player)
      game.update({ specificEntityTurn: 0 });

      // Skipping turn
      if (player.getCurrent().skipTurn === true) this.switchTurn();

      // Resetting the player actions
      player.update({ actionsLeft: player.getCurrent().actions });
    },

    // Function to handle the enemies turn. Starts from the enemy 1
    handleEnemiesTurn(enemyId: EntityIds = 1) {
      // First of all, sets the specific entity turn
      game.update({ specificEntityTurn: enemyId });

      // Getting the entity by its id
      const enemy = enemies.getCurrent(enemyId);

      // Executing its turn
      this.enemyTurn(enemy as Enemy).then(() => {
        // Getting the amount of enemies
        const enemiesAmount = (enemies.getCurrent() as Enemy[]).length;

        // Setting the specific turn to the next enemy
        const nextEntity = enemyId + 1;

        // If the player died, will skip all turns
        if (player.getCurrent().isDead()) {
          game.update({ currentTurn: null });
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

      // Verifying if the game.getCurrent().currentTurn is switchable
      if (!validTurns.includes(game.getCurrent().currentTurn)) {
        return console.warn("⚠️ At switchTurn function: the current turn is not switchable.");
      }

      // Switching the current turn
      if (!nextTurn) {
        nextTurn =
          game.getCurrent().currentTurn === "player"
            ? "enemies" // If the current turn is "player", the next is "enemies"
            : "player"; // Same thing from above
      }

      // Defining the next turn
      game.update({ currentTurn: nextTurn });
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

        const turn = enemy.handleTurn(player.getCurrent());

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
}
