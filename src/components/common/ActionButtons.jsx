// Stylesheet
import styles from './ActionButtons.module.css';



function ActionButtons(props) {
  return (
  <div className={styles["action-buttons-container"]}>
    <button className='default' onClick={props.attack}>Attack</button>
    <button className='default' onClick={props.sendMsg}>Message</button>
    <button className='default' onClick={props.changeAnim}>Change Animation</button>
    <button className='default' onClick={props.endTurn}>End Turn</button>
  </div>
  );
}

export default ActionButtons;