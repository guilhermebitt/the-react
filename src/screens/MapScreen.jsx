// Data
import mapsData from '../data/maps.json' with { type: 'json' };

// Dependencies
import { useEffect, useState } from 'react';

// Components
import Header from '../components/game/Header.jsx';
import ComponentBorder from '../components/ui/ComponentBorder.jsx';
import MapSection from '../components/map/MapSection.jsx';

// Hooks
import { useGame } from '../hooks/useGame.js';

// Stylesheets
import styles from './MapScreen.module.css';
import '../assets/css/scrollbar.css';

// Defining the paths URL
var pathsUrl = [
  "/assets/map_sections/paths/straight_1.png",
  "/assets/map_sections/paths/straight_2.png",
  "/assets/map_sections/paths/bifurcation.png",
  "/assets/map_sections/paths/bifurcation_inverted.png"
];



// Creating the MapScreen
function MapScreen() {
  const { game } = useGame();
  const [load, setLoad] = useState(false);

  // This will make sure that the game only load after the first construction of the component
  useEffect(() => {
    setLoad(true);
  }, []);

  function getPath(selfL, nextL) {
    const bottomPath = pathsUrl[selfL - 1];
    let topPath;

    if (selfL === 1 && nextL === 1) {
      topPath = pathsUrl[0];  // straight_1
    } else
    if (selfL === 2 && nextL === 2) {
      topPath = pathsUrl[1];  // straight_2
    } else
    if (selfL === 1 && nextL === 2) {
      topPath = pathsUrl[2];  // bifurcation
    } else
    if (selfL === 2 && nextL === 1) {
      topPath = pathsUrl[3];  // bifurcation_inverted
    } else {
      topPath = pathsUrl[selfL - 1];
    }

    return [bottomPath, topPath];
  }

  if (!load) return;
  return (
    <main id={styles.mapScreen}>
      {/* TOP SECTION */}
      <section className={`${styles.xSection} ${styles.top}`}>
        <Header />
      </section>

      {/* MAP SECTION */}
      <section className={`${styles.xSection} ${styles.map}`}>
        <ComponentBorder title={mapsData[game.get()?.currentMap]?.name}>

          <div className={`${styles.mapSections} scrollbar`}>
            {/* MAP CONTENTS */}
            {game.get()?.mapData && game.get().mapData
              .reverse()
              .map((section, index) => {
                // Adding the map section components to the MapScreen

                console.log(game.get().mapData[index]?.events.length)

                // Getting the next section (to configure the path)
                const thisSeEv = game.get().mapData[index + 0]?.events.length;
                const nextSeEv = game.get().mapData[index + 1]?.events.length;

                const paths = getPath(thisSeEv, nextSeEv);

                // Returning the MapSection with its props
                return <MapSection key={index} background={section.url} paths={paths} teste={section.events}/>
              })
            }
          </div>

        </ComponentBorder>
      </section>
    </main>
  );
};

// Exporting the MapScreen component as default
export default MapScreen;
