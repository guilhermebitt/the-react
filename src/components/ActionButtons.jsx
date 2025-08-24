// Stylesheet
import '../assets/css/components_style/ActionButtons.css';



function ActionButtons(props) {
  return (
  <div className="action-buttons-container">
    <button onClick={props.attack}>Attack</button>
    <button onClick={props.sendMsg}>Message</button>
    <button onClick={props.changeAnim}>Change Animation</button>
    <button onClick={props.endTurn}>End Turn</button>
  </div>
  );
}

export default ActionButtons;