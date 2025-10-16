// Dependencies
import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { produce } from 'immer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

// Components
import ComponentBorder from '../ui/ComponentBorder';

// Hooks
import { useGame } from '../../hooks/useGame';

// Stylesheets
import styles from './LogContainer.module.css';
import '../../assets/css/scrollbar.css';

function LogContainer() {
  const { game } = useGame();
  const logText = game.get().logText;
  const [, setSettings] = useLocalStorage('settings');

  useEffect(() => {
    if (logText.length > 200) {
      const newLogText = [...logText];

      // Reverses the log text
      newLogText.reverse();
      // Removes the last item
      newLogText.pop(0);
      // Returns the log to normal
      newLogText.reverse();

      game.update({ logText: newLogText });
    }
  }, [logText]);

  function closeLog() {
    setSettings(
      produce((draft) => {
        draft.showLog = false;
      })
    );
  }

  return (
    <div className="backdrop">
      <ComponentBorder
        title="Log"
        boxStyles={{
          height: 'fit-content',
          width: '500px',
          backgroundColor: 'black',
        }}
        titleStyles={{ backgroundColor: 'black' }}
      >
        <div className={styles.logContainer}>
          <button className={styles.close} onClick={closeLog}>
            <FontAwesomeIcon 
              id={styles["music-icon"]} 
              icon={faXmark}
            />
          </button>
          <div className={`${styles.textContainer} scrollbar-black`}>
            {(Array.isArray(logText) ? logText : [])
              .slice() // creates a copy
              .reverse() // reverts the order
              .map((html, index) => (
                <div
                  key={index}
                  className={styles.logLine}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ))}
          </div>
        </div>
      </ComponentBorder>
    </div>
  );
}

export default LogContainer;
