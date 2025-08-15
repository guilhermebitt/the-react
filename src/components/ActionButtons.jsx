// Stylesheet
import '../assets/css/components_style/buttons.css';



function ActionButtons(props) {
  return (
  <div className="action-buttons-container">
    <button onClick={props.attack}>Attack</button>
    <button onClick={props.sendMsg}>Message</button>
    <button>Use Item</button>
    <button>Run</button>
  </div>
  );
}

export default ActionButtons;