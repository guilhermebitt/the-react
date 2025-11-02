// Data
import mapsData from '../data/maps.json';
import gameData from '../data/game.json';

// Dependencies
import { useEffect } from 'react';
import { getMapAssets } from '../utils/loadAssets';

// Components
import Header from '../components/game/Header';
import ComponentBorder from '../components/ui/ComponentBorder';
import MapSection from '../components/map/MapSection';
import Loading from '../components/common/Loading';

// Hooks
import { useLoading } from '../hooks/useLoading';

// Store
import { useStore } from '@/stores';

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

// Defining the badges URL
var badgesUrl = [
  "/assets/map_sections/events_badges/battle_badge.png",
  "/assets/map_sections/events_badges/boss_badge.png",
  "/assets/map_sections/events_badges/loot_badge.png",
  "/assets/map_sections/events_badges/shop_badge.png",
  "/assets/map_sections/events_badges/unknown_badge.png",
];

// Creating the MapScreen
function MapScreen() {
  // Stores
  const tick = useStore("tick", "actions");
  const audiosActions = useStore("audios", "actions");
  const enemiesActions = useStore("enemies", "actions");
  const game = useStore("game", "actions");

  const { loading, loadAssets } = useLoading();
  const mapArea = structuredClone(game.getCurrent().mapArea);

  // LOADING
  useEffect(() => {
    const mapAssets = getMapAssets(mapArea);
    const assetsToLoad = [...mapAssets, ...pathsUrl, ...badgesUrl];

    loadAssets(assetsToLoad);
  }, []);

  // This will make sure that the game only load after the first construction of the component
  useEffect(() => {
    if (loading) return;

    // Resuming the tick count
    tick.start();

    // Stopping the game music if it is playing
    if (audiosActions.getAudio("gameMusic")?.isPlaying()) audiosActions.getAudio("gameMusic")?.pause();
    if (audiosActions.getAudio("menuMusic")?.isPlaying()) audiosActions.getAudio("menuMusic")?.pause();

    audiosActions.getAudio("mapMusic")?.start();

    // Resetting all game eventData and enemies
    game.update({ eventData: gameData["eventData"] });
    enemiesActions.reset();

    return () => {
      tick.stop();  // tick stops when the game exit the map component
      if (audiosActions.getAudio("mapMusic").isPlaying()) audiosActions.getAudio("mapMusic").pause();
    }
  }, [loading]);

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

  function getBadges(selfL, index) {
    let types = [];

    for (let i = 0; i < selfL; i++) {
      const type = mapArea[index]?.events[i];
      types.push(type);
    }

    return types;
  }

  if (loading) return <Loading />
  return (
    <main id={styles.mapScreen}>
      {/* TOP SECTION */}
      <section className={`${styles.xSection} ${styles.top}`}>
        <Header />
      </section>

      {/* MAP SECTION */}
      <section className={`${styles.xSection} ${styles.map}`}>
        <ComponentBorder title={mapsData[game.getCurrent()?.currentMap]?.name}>

          <div className={`${styles.mapSections} scrollbar`}>
            {/* MAP CONTENTS */}
            {}
            {mapArea && mapArea
              .map((section, index) => {
                // Adding the map section components to the MapScreen

                // Getting the next section (to configure the path)
                const thisSeEv = game.getCurrent().mapArea[index + 0]?.events.length;
                const nextSeEv = game.getCurrent().mapArea[index + 1]?.events.length;

                const paths = getPath(thisSeEv, nextSeEv);

                // THIS FUNCTION CANNOT BE HERE. THIS FUNCTION CREATES A BADGE AND NOT GET IT!!!!!!!
                const badges = getBadges(thisSeEv, index);

                // Returning the MapSection with its props
                return <MapSection key={index} background={section.url} paths={paths} badges={badges} index={index}/>
              })
            }
          </div>

        </ComponentBorder>
      </section>
    </main>
  );
}

// Exporting the MapScreen component as default
export default MapScreen;
