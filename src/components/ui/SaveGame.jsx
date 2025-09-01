// Data
import gameData from '../../data/game.json' with { type: 'json' }
import playerData from '../../data/player.json' with { type: 'json' }
import savesData from '../../data/saves.json' with { type: 'json' }
import maps from '../../data/maps.json' with { type: 'json' }

// Dependencies
import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { produce } from 'immer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlay } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

// Hooks
import { useGame } from '../../hooks/useGame';

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
  const { player, enemies, game } = useGame();


  function confirmScreen(onConfirm, onCancel, msg='Are you sure?') {
    setConfirmDialog({
      visible: true,
      message: msg,
      onConfirm: onConfirm || (() => {}),
      onCancel: onCancel || (() => setConfirmDialog(prev => ({ ...prev, visible: false }))),
    });
  }

  function newSave() {
    setSaves(
      produce(draft => {
        const save = draft.find(e => e.id === saveId);
        if (save) Object.assign(save, {game: gameData, enemies: [], player: playerData});
      })
    );
  }

  function getMap(game) {
    return maps[game.currentMap];
  }

  function deleteSave() {
    setSaves(
      produce(draft => {
        const save = draft.find(e => e.id === saveId);
        if (save) {
          // Removing each propriety, maintaining only the id
          Object.keys(save).forEach(key => {
            if (key !== 'id') delete save[key];
          });
        }
      })
    );
  }

  function startSave() {
    game.update({ currentSave: saveId })
    navigate('/game');

    // Logic to load the save
  }

  return (
    <>
    {/* CONFIRM DIALOG */}
      <ConfirmDialog 
        visible={confirmDialog.visible}
        message={confirmDialog.message}
        onConfirm={() => {
          confirmDialog.onConfirm?.();
          setConfirmDialog(prev => {return{...prev, visible: false}});
        }}
        onCancel={() => {
          confirmDialog.onCancel?.();
          setConfirmDialog(prev => {return{...prev, visible: false}});
        }}
      />
      <section className={styles.saveGameContainer}>
        {
        saves[saveId].game ?
        <div className={styles.save}>
          <div className={styles.infoContainer}>
            <img className={styles.saveImg} src={getMap(saves[saveId].game).src} alt="" />
            <div className={styles.info}>
              <p>Map: {getMap(saves[saveId].game).name}</p>
              <p>Game Time: WIP</p>
              <p>Experience: WIP</p>
              <p>Money: WIP</p>
            </div>
          </div>
          <div className={styles.actions}>
            <button onClick={() => confirmScreen(deleteSave, null, "Do you REALLY want to delete?")}><FontAwesomeIcon icon={faTrash}/></button>
            <button onClick={startSave}><FontAwesomeIcon icon={faPlay}/></button>
          </div>
        </div> :
        <button className={styles.newSave} onClick={newSave}>New Save Game</button>
        }
      </section>
    </>
  );
};

export default SaveGame;