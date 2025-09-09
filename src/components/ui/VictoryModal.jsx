// Dependencies
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // This is temporary
import * as funcs from '../../utils/functions.js';

// Hooks
import { useGame } from '../../hooks/useGame';

// Stylesheet
import styles from './VictoryModal.module.css';

function VictoryModal() {
  const { tick, game, player } = useGame();
  const [eventTime, setEventTime] = useState(null);

  useEffect(() => {
    if (eventTime) return;
    setEventTime(getEventTime());
  }, [])

  function getEventTime() {
    const timeEntered = game.get().eventData.timeEntered;
    const currentTime = tick.get();

    const timeInEvent = currentTime - timeEntered;

    return funcs.tickToTime(timeInEvent, game.get().tickSpeed);
  }

  return (
    <div className='backdrop'>
      <div className={styles.container}>

        <p>You Win</p>

        <div className={styles.info}>
          <p>Event Duration: {eventTime}</p>
          <p>Enemies Killed: {player.get().kills || 0}</p>
        </div>
        
        <div className={styles.buttons}>
          {/* This is temporary */}
          <Link to="/menu">
            <button>Continue</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VictoryModal;