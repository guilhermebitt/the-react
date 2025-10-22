// Dependencies
import { useLocalStorage } from 'usehooks-ts';

// Hooks
import { useGame } from './useGame';

// Store
import { useStore } from '@/stores';

export const useSaveManager = (saveId) => {
  const { enemies, game } = useGame();

  // Store
  const [getCurrentTick, updateTick] = useStore("tick", state => [state.getCurrent, state.update]);
  const playerAc = useStore("player", "actions");

  const [saves, setSaves] = useLocalStorage('saves', {});

  const saveGame = () => {
    try {
      const gameState = {
        player: playerAc.getPlayer(),
        enemies: enemies.get(),
        game: game.get(),
        tick: getCurrentTick(),
      };
      setSaves((prevSaves) => ({
        ...prevSaves,
        [saveId]: gameState,
      }));
    } catch (error) {
      console.error('Error saving the game:', error);
    }
  };

  const loadGame = (savedState = null) => {
    try {
      if (!savedState) {
        savedState = saves[saveId];
      }

      if (!savedState) {
        return;
      }

      // Resetting all contexts
      playerAc.reset();
      enemies.reset();
      game.reset();
      updateTick(0);

      // Re-loading all contexts
      playerAc.loadSave(savedState.player);
      enemies.loadSave(savedState.enemies);
      game.loadSave(savedState.game);
      updateTick(savedState.tick)

      game.update({ currentSave: saveId });
    } catch (error) {
      console.error('Error loading the game:', error);
    }
  };

  const deleteSave = () => {
    try {
      setSaves((prevSaves) => {
        const newSaves = { ...prevSaves };
        delete newSaves[saveId];
        return newSaves;
      });
    } catch (error) {
      console.error('Error deleting the save:', error);
    }
  };

  const resetGame = () => {
    // Resetting all contexts
    playerAc.reset();
    enemies.reset();
    game.reset();
    updateTick(0);
  };

  return { saveGame, loadGame, deleteSave, resetGame };
};
