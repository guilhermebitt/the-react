// Dependencies
import { useLocalStorage } from 'usehooks-ts';

// Store
import { useStore } from '@/stores';

export const useSaveManager = (saveId) => {
  // Store
  const [getCurrentTick, updateTick] = useStore("tick", state => [state.getCurrent, state.update]);
  const playerAc = useStore("player", "actions");
  const enemiesAc = useStore("enemies", "actions");
  const gameAc = useStore("game", "actions");

  const [saves, setSaves] = useLocalStorage('saves', {});

  const saveGame = () => {
    try {
      const gameState = {
        player: playerAc.getCurrent(),
        enemies: enemiesAc.getCurrent(),
        game: gameAc.getCurrent(),
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
      enemiesAc.reset();
      gameAc.reset();
      updateTick(0);

      // Re-loading all contexts
      playerAc.loadSave(savedState.player);
      enemiesAc.loadSave(savedState.enemies);
      gameAc.loadSave(savedState.game);
      updateTick(savedState.tick)

      gameAc.update({ currentSave: saveId });
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
    enemiesAc.reset();
    gameAc.reset();
    updateTick(0);
  };

  return { saveGame, loadGame, deleteSave, resetGame };
};
