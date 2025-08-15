import '../assets/css/components_style/EntityContainer.css';

// Requirements
import { useEffect } from 'react';

function EntityContainer(props) {

  return <div className="entity-container">
    {/* Renders entity here */}
    <h2>{props.entity?.name}</h2>
    <img src={props.entity?.img} alt="entity image" />
  </div>;
}

export default EntityContainer;
