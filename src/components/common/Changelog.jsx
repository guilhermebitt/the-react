// Dependencies
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';

// Stylesheets
import styles from './Changelog.module.css';



function Changelog() {
  const [text, setText] = useState('Loading Changelog...');

  useEffect(() => {
    // Getting the text of CHANGELOG.md

    fetch('../../../CHANGELOG.md')
      .then((response) => response.text()) // Parse the response as text

      .then((textData) => {
        setText(textData);
      })

      .catch((error) => console.error('Error fetching the text file:', error));
  }, []);

  return (
    <div className={styles.changelogContainer}>
      <h1>ChangeLog</h1>
      <ReactMarkdown>
        {text}
      </ReactMarkdown>
    </div>
  );
}

export default Changelog;
