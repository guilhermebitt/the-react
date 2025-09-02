// Dependencies
import { useLocalStorage } from 'usehooks-ts';

// Hooks
import { useGame } from './useGame.js';



export const useSaveManager = (saveId) => {
  const { player, enemies, game } = useGame();
  const [saves, setSaves] = useLocalStorage('saves', {});

  const saveGame = () => {
    try {
      const gameState = {
        player: player.get(),
        enemies: enemies.get(),
        game: game.get(),
      };
      setSaves((prevSaves) => ({
        ...prevSaves,
        [saveId]: gameState,
      }));
    } catch (error) {
      console.error('Error saving the game:', error);
    }
  };

  const loadGame = () => {
    try {
      const savedState = saves[saveId];
      if (!savedState) {
        return;
      }

      // Resetting all contexts
      player.reset()
      enemies.reset()
      game.reset()

      // Re-loading all contexts
      player.loadSave(savedState.player);
      enemies.loadSave(savedState.enemies);
      game.loadSave(savedState.game);

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

  return { saveGame, loadGame, deleteSave };
};