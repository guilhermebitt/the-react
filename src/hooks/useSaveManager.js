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
      alert('Jogo salvo com sucesso!');
    } catch (error) {
      console.error('Falha ao salvar o jogo:', error);
      alert('Erro ao salvar o jogo.');
    }
  };

  const loadGame = () => {
    try {
      const savedState = saves[saveId];
      if (!savedState) {
        alert('Nenhum jogo salvo foi encontrado.');
        return;
      }
      
      player.reset()
      enemies.reset()
      game.reset()

      player.loadSave(savedState.player);
      enemies.loadSave(savedState.enemies);
      game.loadSave(savedState.game);
      game.update({ currentSave: saveId });
      alert('Jogo carregado com sucesso!');
    } catch (error) {
      console.error('Falha ao carregar o jogo:', error);
      alert('Erro ao carregar o jogo.');
    }
  };

  const deleteSave = () => {
    try {
      setSaves((prevSaves) => {
        const newSaves = { ...prevSaves };
        delete newSaves[saveId];
        return newSaves;
      });
      alert('Save deletado com sucesso!');
    } catch (error) {
      console.error('Falha ao deletar o save:', error);
      alert('Erro ao deletar o save.');
    }
  };

  return { saveGame, loadGame, deleteSave };
};