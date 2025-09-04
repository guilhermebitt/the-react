// Stylesheet
import styles from './SectionButtons.module.css';



function SectionButtons(props) {
  return (
  <div className={styles.container}>
    <button onClick={props.sendMsg} className='default'>Stats</button>
    <button className='default'>Inventory</button>
    <button className='default'>Spells</button>
    <button className='default'>WIP</button>
  </div>
  );
}

export default SectionButtons;