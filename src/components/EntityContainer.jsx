// Dependencies
import { useEffect } from 'react';

// Components
import Stats from "./Stats";

// Stylesheet
import '../assets/css/components_style/EntityContainer.css';



function EntityContainer({entity}) {

  return (
    <div className="entity-container">
      <h2>{entity?.name}</h2>
      <img src={entity?.img} alt="entity image" />
      <Stats entity={entity} />
    </div>
  );
}

export default EntityContainer;
