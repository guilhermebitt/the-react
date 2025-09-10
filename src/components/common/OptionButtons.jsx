// Dependencies
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Components
import ComponentBorder from '../ui/ComponentBorder';
import ConfirmDialog from './ConfirmDialog';

// Hooks
import { useGame } from '../../hooks/useGame';
import { useSaveManager } from '../../hooks/useSaveManager';

// Stylesheet
import styles from './OptionButtons.module.css';



function OptionButtons() {
  const { game } = useGame();
  const { saveGame } = useSaveManager(game.get().currentSave);
  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    message: 'Are you sure?',
    onConfirm: null,
    onCancel: null
  });
  const [ShowLastCScreen, setShowLastCScreen] = useState(false);

  useEffect(() => {
    if (!ShowLastCScreen) return;
    confirmScreen(null, null, "Game Saved!")
    setShowLastCScreen(false);
  }, [ShowLastCScreen]);

  function confirmScreen(onConfirm, onCancel, msg='Are you sure?') {
    setConfirmDialog({
      visible: true,
      message: msg,
      onConfirm: onConfirm || (() => {}),
      onCancel: onCancel,
    });
  }

  return (
    <>
      <ConfirmDialog 
        visible={confirmDialog.visible}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm && (() => {
          confirmDialog.onConfirm?.();
          setConfirmDialog(prev => {return{...prev, visible: false}});
        })}
        onCancel={confirmDialog.onCancel && (() => {
          confirmDialog.onCancel?.();
          setConfirmDialog(prev => {return{...prev, visible: false}});
        })}
      />
      <ComponentBorder title="Options">
        <div className={styles["options-menu-container"]}>
          <Link to="/settings">
            <button className='default'>Settings</button>
          </Link>
          <Link to="/menu">
            <button className='default'>Menu</button>
          </Link>
          <button className='default' onClick={() => {
            confirmScreen(() => {
              saveGame();
              setShowLastCScreen(true);
            }, () => setConfirmDialog(prev => ({ ...prev, visible: false })))
          }} disabled={!(game.get().currentTurn === "player")}>Save Game</button>
        </div>
      </ComponentBorder>
    </>
  );
}

export default OptionButtons;