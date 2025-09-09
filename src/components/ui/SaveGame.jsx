// Data
import gameData from '../../data/game.json' with { type: 'json' }
import playerData from '../../data/player.json' with { type: 'json' }
import savesData from '../../data/saves.json' with { type: 'json' }
import maps from '../../data/maps.json' with { type: 'json' }

// Dependencies
import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlay } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import * as funcs from '../../utils/functions.js';

// Hooks
import { useGame } from '../../hooks/useGame.js';
import { useSaveManager } from '../../hooks/useSaveManager';

// Components
import ConfirmDialog from '../common/ConfirmDialog';

// Stylesheets
import styles from './SaveGame.module.css';


function SaveGame({ saveId }) {
  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    message: 'Are you sure?',
    onConfirm: null,
    onCancel: null
  });
  const [saves, setSaves] = useLocalStorage('saves', savesData)
  const navigate = useNavigate();
  const { loadGame, deleteSave } = useSaveManager(saveId);
  const { tick, game } = useGame();

  function confirmScreen(onConfirm, onCancel, msg='Are you sure?') {
    setConfirmDialog({
      visible: true,
      message: msg,
      onConfirm: onConfirm || (() => {}),
      onCancel: onCancel || (() => setConfirmDialog(prev => ({ ...prev, visible: false }))),
    });
  }

  function getMap(game) {
    return maps[game.currentMap];
  }

  function handleStartGame() {
    loadGame();
    navigate('/game');
  }

  function handleNewSave() {
    // This function will trigger the save process for a new game.
    // We can't directly use the `saveGame` from the hook here as it needs current game data.
    // Instead, we can create a temporary game state with default data and save it.
    // Alternatively, you can save a predefined new game state.
    const newGameState = {
        player: playerData,
        enemies: [],
        game: gameData,
        tick: 0
    };
    setSaves(prevSaves => ({
        ...prevSaves,
        [saveId]: newGameState
    }));
    
    // Now load it
    loadGame();
  }

  function getTime() {
    const savedState = saves[saveId]
    return funcs.tickToTime(savedState.tick, game.get().tickSpeed)
  }

  return (
    <>
      <ConfirmDialog 
        visible={confirmDialog.visible}
        message={confirmDialog.message}
        onConfirm={() => {
          confirmDialog.onConfirm?.();
          setConfirmDialog(prev => ({...prev, visible: false}));
        }}
        onCancel={() => {
          confirmDialog.onCancel?.();
          setConfirmDialog(prev => ({...prev, visible: false}));
        }}
      />
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
              <button onClick={() => confirmScreen(deleteSave, null, "Do you REALLY want to delete?")}><FontAwesomeIcon icon={faTrash}/></button>
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