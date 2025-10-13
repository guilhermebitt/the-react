// Data
import gameData from '../../data/game.json' with { type: 'json' }
import playerData from '../../data/player.json' with { type: 'json' }
import savesData from '../../data/saves.json' with { type: 'json' }
import maps from '../../data/maps.json' with { type: 'json' }

// Dependencies
import { useState, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlay } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import * as funcs from '../../utils/functions.js';

// Custom Hooks
import { useGame } from '../../hooks/useGame.js';
import { useSaveManager } from '../../hooks/useSaveManager';
import { useConfirmDialog } from '../../hooks/useConfirmDialog.jsx';

// Stylesheets
import styles from './SaveGame.module.css';

function SaveGame({ saveId }) {
  const [CDComponent, confirm] = useConfirmDialog();
  const [saves, setSaves] = useLocalStorage('saves', savesData)
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const { loadGame, deleteSave } = useSaveManager(saveId);
  const { game } = useGame();

  // Reacts to the change of the load (game load)
  useEffect(() => {
    if (!load) return;

    navigate(game.get()?.eventData?.path);
  }, [load])

  function getMap(game) {
    return maps[game.currentMap];
  }

  function handleStartGame() {
    loadGame();
  
    setLoad(true);
  }

  function handleNewSave() {
    // This function will trigger the save process for a new game.
    // We can't directly use the `saveGame` from the hook here as it needs current game data.
    // Instead, we can create a temporary game state with default data and save it.
    // Alternatively, you can save a predefined new game state.
    const newGameState = structuredClone({
      player: playerData,
      enemies: [],
      game: gameData,
      tick: 0
    });

    // Generating the first region
    console.log("Creating first region...")
    const result = game.createRegion();

    // Getting the regionKey
    const { regionKey } = result || {regionKey: null};

    console.log("REGION KEY:", regionKey)

    // Updating the gameData with the region
    newGameState.game.currentMap = regionKey || "wildForest";
    
    setSaves(prevSaves => ({
      ...prevSaves,
      [saveId]: newGameState
    }));
    
    // Now load it
    loadGame(newGameState);
  }

  async function handleDelete() {
    const result = await confirm("Do you REALLY want to delete?");
    if (result) {
      deleteSave();
    }
  }

  function getTime() {
    const savedState = saves[saveId]
    return funcs.tickToTime(savedState.tick, game.get().tickSpeed)
  }

  return (
    <>
      {CDComponent}
      <section className={styles.saveGameContainer}>
        {
          saves[saveId]?.game ?
          <div className={styles.save}>
            <div className={styles.infoContainer}>
              <img className={styles.saveImg} src={getMap(saves[saveId].game).src} alt="" />
              <div className={styles.info}>
                <p>Map: {getMap(saves[saveId].game).name}</p>
                <p>Game Time: {getTime()}</p>
                <p>Money: {saves[saveId].player.stats.money}</p>
              </div>
            </div>
            <div className={styles.actions}>
              <button onClick={handleDelete}><FontAwesomeIcon icon={faTrash}/></button>
              <button onClick={handleStartGame}><FontAwesomeIcon icon={faPlay}/></button>
            </div>
          </div> :
          <button className={styles.newSave} onClick={handleNewSave}>New Save Game</button>
        }
      </section>
    </>
  );
};

export default SaveGame;