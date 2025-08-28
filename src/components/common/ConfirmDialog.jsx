// Dependencies
import { useState } from 'react';

// Stylesheet
import styles from './ConfirmDialog.module.css';



function ConfirmDialog({ visible, message, onConfirm, onCancel }) {
  const [animated, setAnimated] = useState(false);

  if (!visible) return null;  // ends the component if the visible is false

  const handleClickOutside = () => {
    setAnimated(true);
    const timer = setTimeout(() => {
      setAnimated(false);
    }, 1000)
  }

  const handleBoxClick = (e) => {
    e.stopPropagation(); // this will guarantee that the click doesn't count to the backdrop
  };

  return (
    <div className={styles["confirm-backdrop"]} onClick={handleClickOutside}>
      <div
        className={`${styles["confirm-box"]} ${animated ? styles.animated : ''}`} 
        onClick={handleBoxClick}>
          
        <p>{message}</p>

        <div className={styles.buttons}>
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmDialog;