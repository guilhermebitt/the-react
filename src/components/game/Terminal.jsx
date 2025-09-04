// Dependencies
import { useEffect } from 'react';

// Components
import ComponentBorder from '../ui/ComponentBorder';

// Hooks
import { useGame } from '../../hooks/useGame';

// Stylesheets
import styles from './Terminal.module.css';
import '../../assets/css/scrollbar.css'

function Terminal() {
  //const [terminalText, setTerminalText] = useLocalStorage('terminalText', []);
  const { game } = useGame();
  const terminalText = game.get().terminalText;

  useEffect(() => {
    // Verifying if the terminal text change, when the
    // length hit the max (30), the last messages will
    // be removed. But the text will be kept into log

    if (terminalText.length > 20) {
      const newTerminalText = [...terminalText];

      newTerminalText.splice(20, 1);

      game.update({ "terminalText": newTerminalText })
    }
  }, [terminalText]);

  return (
    <ComponentBorder title='Terminal'>
      <div className={`${styles.terminal} scrollbar`}>
        {(Array.isArray(terminalText) ? terminalText : []).map((html, index) => (
          <div
            key={index}
            className={styles.terminalLine}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ))}
      </div>
    </ComponentBorder>
  );
}

export default Terminal;
