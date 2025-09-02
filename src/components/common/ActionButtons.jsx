// Stylesheet
import styles from './ActionButtons.module.css';



function ActionButtons(props) {
  return (
  <div className={styles["action-buttons-container"]}>
    <button onClick={props.attack}>Attack</button>
    {/*<button onClick={props.sendMsg}>Message</button>*/}
    {/*<button onClick={props.changeAnim}>Change Animation</button>*/}
    <button onClick={props.endTurn}>End Turn</button>
  </div>
  );
}

export default ActionButtons;