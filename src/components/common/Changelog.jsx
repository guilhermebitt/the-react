// Dependencies
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

// Importa o conteúdo do CHANGELOG.md como texto puro
import changelogText from '../../../CHANGELOG.md?raw';

// Stylesheets
import styles from './Changelog.module.css';
import '../../assets/css/scrollbar.css';

function Changelog() {
  // O texto já vem pronto, então não precisamos de loading
  const [displayedLength, setDisplayedLength] = useState(1000);
  const INCREMENT_AMOUNT = 1000;

  const handleShowMore = () => {
    const newLength = displayedLength + INCREMENT_AMOUNT;
    setDisplayedLength(Math.min(newLength, changelogText.length));
  };

  const handleShowLess = () => {
    setDisplayedLength(1000);
  };

  const displayText =
    changelogText.length > displayedLength
      ? changelogText.substring(0, displayedLength) + '...'
      : changelogText;

  const showMoreButton = displayedLength < changelogText.length;
  const showLessButton = displayedLength > 1000 && changelogText.length > 1000;

  return (
    <div className={`${styles.changelogContainer} scrollbar`}>
      <h1>ChangeLog</h1>

      <ReactMarkdown>{displayText}</ReactMarkdown>

      <div className={styles.buttonContainer}>
        {showMoreButton && (
          <button onClick={handleShowMore} className={styles.toggleButton}>
            Show more
          </button>
        )}
        {showLessButton && (
          <button onClick={handleShowLess} className={styles.toggleButton}>
            Show less
          </button>
        )}
      </div>
    </div>
  );
}

export default Changelog;
