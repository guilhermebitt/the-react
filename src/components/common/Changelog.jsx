// Dependencies
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';

// Stylesheets
import styles from './Changelog.module.css';
import '../../assets/css/scrollbar.css';



function Changelog() {
  const [fullText, setFullText] = useState('');
  const [displayedLength, setDisplayedLength] = useState(1000); // Quantidade inicial de caracteres a serem exibidos
  const INCREMENT_AMOUNT = 1000; // Quantos caracteres adicionar a cada clique

  useEffect(() => {
    // Getting the text of CHANGELOG.md
    fetch('../../../CHANGELOG.md')
      .then((response) => response.text())
      .then((textData) => {
        setFullText(textData);
      })
      .catch((error) => console.error('Error fetching the text file:', error));
  }, []);

  const handleShowMore = () => {
    const newLength = displayedLength + INCREMENT_AMOUNT;
    setDisplayedLength(Math.min(newLength, fullText.length));
  };

  const handleShowLess = () => {
    // Resets to initial state
    setDisplayedLength(1000);
  };

  // Determina o texto a ser exibido
  const displayText =
    fullText.length > displayedLength
      ? fullText.substring(0, displayedLength) + '...'
      : fullText;

  // Verifying if the buttons should appear
  const showMoreButton = displayedLength < fullText.length;
  const showLessButton = displayedLength > 1000 && fullText.length > 1000;

  return (
    <div className={`${styles.changelogContainer} scrollbar`}>
      <h1>ChangeLog</h1>
      <ReactMarkdown>{displayText}</ReactMarkdown>

      {/* Control buttons */}
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
