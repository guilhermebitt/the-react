// Dependencies
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// Stylesheet
import styles from './Loading.module.css';



function Loading() {
  return (
    <div className={styles.loadContainer}>
      <FontAwesomeIcon icon={faSpinner} className={styles.spinner}/>
    </div>
  );
}



export default Loading;
