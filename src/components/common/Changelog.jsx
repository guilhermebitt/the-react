// Dependencies
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';

// Stylesheets
import styles from './Changelog.module.css';
import '../../assets/css/scrollbar.css';

function Changelog() {
  const [fullText, setFullText] = useState('');
  const [displayedLength, setDisplayedLength] = useState(1000);
  const [loading, setLoading] = useState(true); // estado para controlar o carregamento
  const INCREMENT_AMOUNT = 1000;

  useEffect(() => {
    fetch('../../../CHANGELOG.md')
      .then((response) => response.text())
      .then((textData) => {
        setFullText(textData);
        setLoading(false); // terminou de carregar
      })
      .catch((error) => {
        console.error('Error fetching the text file:', error);
        setLoading(false); // mesmo com erro, parar o "loading"
      });
  }, []);

  const handleShowMore = () => {
    const newLength = displayedLength + INCREMENT_AMOUNT;
    setDisplayedLength(Math.min(newLength, fullText.length));
  };

  const handleShowLess = () => {
    setDisplayedLength(1000);
  };

  const displayText =
    fullText.length > displayedLength
      ? fullText.substring(0, displayedLength) + '...'
      : fullText;

  const showMoreButton = displayedLength < fullText.length;
  const showLessButton = displayedLength > 1000 && fullText.length > 1000;

  return (
    <div className={`${styles.changelogContainer} scrollbar`}>
      <h1>ChangeLog</h1>

      {/* Renderiza um loading ou o texto */}
      {loading ? (
        <p>Carregando...</p> // aqui você pode colocar um spinner ou skeleton
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default Changelog;