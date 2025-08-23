// Components
import EntityContainer from './EntityContainer.jsx';

// Stylesheet
import '../assets/css/components_style/MapContainer.css';



function MapContainer({player, enemies}) {
  // Passing the entities to a variable
  const entities = [player, ...enemies];

  // Returning the Component
  return (
    <div className="map-container">

      <img src="./assets/scenarios/wild_forest.jpg" alt="game map" id="map" />
      {/* Player on the left */}
      <div className="player-side">
        <EntityContainer entityData={player} />
      </div>

      {/* Enemies on the right */}
      <div className="enemies-side">
        {enemies.map((enemy, index) => (
          <EntityContainer key={index} entityData={enemy} />
        ))}
      </div>
    </div>
  );
}

export default MapContainer;
