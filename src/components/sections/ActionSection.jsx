// Dependencies
import * as funcs from '../../utils/functions.js';
import { useState } from 'react';

// Components
import ActionButtons from '../common/ActionButtons.jsx';
import Terminal from '../game/Terminal.jsx';
import Stats from '../ui/Stats.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';

// Hooks
import { useGame } from '../../hooks/useGame.js';

function ActionSection() {
  const { player, enemies, game } = useGame();
  const [confirmDialog, setConfirmDialog] = useState({
      visible: false,
      message: 'Are you sure?',
      onConfirm: null,
      onCancel: null
    });

  // Passing the game controller to the funcs
  funcs.init(game);

  // Function to realize an attack
  function doAttack() {
    // Conditions
    if (typeof game.get().target !== 'number') return funcs.phrase('Select a target!');
    if (player.get().actionsLeft <= 0) return funcs.phrase('You do not have actions left!');
    if (enemies.get([game.get().target])?.currentAnim === 'death') return funcs.phrase('This enemy is dead.');

    const { attackMsg, timeToWait } = player.get().attack(enemies.get([game.get().target]));  // this function executes an attack and return some data

    // Changing the turn 
    const lastTurn = game.get().currentTurn;
    game.update({ currentTurn: 'onAction' });

    setTimeout(() => {
      game.update({ currentTurn: lastTurn });
    }, timeToWait);
    // ------------------

    funcs.phrase(attackMsg);  // showing the result of the attack
    player.update({ actionsLeft: p => p.actionsLeft - 1 })
  }

  function confirmScreen(onConfirm, onCancel, msg='Are you sure?') {
    setConfirmDialog({
      visible: true,
      message: msg,
      onConfirm: onConfirm || (() => {}),
      onCancel: onCancel || (() => setConfirmDialog(prev => ({ ...prev, visible: false }))),
    });
  }

  // Returning the section
  return (
    <>
      {/* Confirm dialog */}
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

      {/* Rest of the component */}
      <ActionButtons
        attack={() => game.get().currentTurn === 'player' && doAttack()}
        changeAnim={null}
        sendMsg={() => funcs.phrase('Hi!')}
        endTurn={() =>
          game.get().currentTurn === 'player' &&
          confirmScreen(() => {
            funcs.endTurn('enemies');
          })
        }
      />
      <Terminal />
      <Stats entity={player.get()} />
    </>
  );
}

export default ActionSection;
