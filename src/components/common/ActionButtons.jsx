// Components
import ComponentBorder from '../ui/ComponentBorder';

// Stylesheet
import styles from './ActionButtons.module.css';



function ActionButtons(props) {
  return (
    <ComponentBorder title='Action'>
      <div className={styles.actBtnContainer}>
        <button className='default' onClick={props.attack}>Attack</button>
        <button className='default' onClick={props.sendMsg}>Message</button>
        <button className='default' onClick={props.changeAnim}>Change Animation</button>
        <button className='default' onClick={props.endTurn}>End Turn</button>
      </div>
    </ComponentBorder>
  );
}

export default ActionButtons;