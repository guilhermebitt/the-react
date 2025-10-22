// Dependencies
import { useEffect } from 'react';

// Components
import ComponentBorder from '../ui/ComponentBorder';

// Hooks
import { useStore } from '@/stores';

// Stylesheets
import styles from './Terminal.module.css';
import '../../assets/css/scrollbar.css';



function Terminal() {
  const game = useStore("game", "actions");
  const terminalText = game.getCurrent().terminalText;

  useEffect(() => {
    // Verifying if the terminal text change, when the
    // length hit the max (30), the last messages will
    // be removed. But the text will be kept into log

    if (terminalText.length > 20) {
      const newTerminalText = [...terminalText];

      // Reverses the terminal text
      newTerminalText.reverse();
      // Removes the last item
      newTerminalText.pop(0);
      // Returns the terminal to normal
      newTerminalText.reverse();

      game.update({ "terminalText": newTerminalText })
    }
  }, [terminalText]);

  return (
    <ComponentBorder title='Terminal'>
      <div className={`${styles.terminal} scrollbar`}>
        {(Array.isArray(terminalText) ? terminalText : [])
          .slice() // creates a copy
          .reverse() // reverts the order
          .map((html, index) => (
            <div
              key={index}
              className={styles.terminalLine}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ))
        }
      </div>
    </ComponentBorder>
  );
}

export default Terminal;
