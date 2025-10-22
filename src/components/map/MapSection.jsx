// Dependencies
import { useState, useEffect } from 'react';

// Components
import EventBadge from './EventBadge';
import Clouds from './Clouds';

// Hooks
import { useStore } from '@/stores';

// Stylesheets
import styles from './MapSection.module.css';



function MapSection({ background, paths, badges, index }) {
  const [cloud, setCloud] = useState("");
  // Stores
  const game = useStore("game", "actions");

  useEffect(() => {
    const currentMS = game.getCurrent().currentMapSection;

    // For some reason this need to be here and not in the MapScreen.jsx
    window.location.hash = currentMS;
    if (currentMS < game.getCurrent().mapArea.length) {
      window.location.hash = currentMS;
    } else {
      window.location.hash = game.getCurrent().mapArea.length - 1;
    }

    if (index <= currentMS) {
      setCloud("none");
    } else
    if (index === currentMS + 1) {
      setCloud("starting");
    } else {
      setCloud("full");
    }
  }, [])

  return (
    <section id={index} className={styles.mapSection} style={{ backgroundImage: `url(${background})`}}>
      {/* ------- CLOUDS ------- */}
      <div className={styles.cloudsContainer}>
        <Clouds type={cloud}/>
      </div>
      {cloud === "starting" &&
        <div className={`${styles.cloudsContainer} ${styles.up}`}>
          <Clouds type={"full"}/>
        </div>
      }
      

      {/* ------- PATHS ------- */}
      {/* TOP PATH */}
      <div className={`${styles.path} ${styles.top}`} style={{ backgroundImage: `url(${paths[1]})`}}/>

      {/* BOTTOM PATH */}
      <div className={`${styles.path} ${styles.bottom}`} style={{ backgroundImage: `url(${paths[0]})`}}/>

      {/* ------- BADGES ------- */}
      <div className={styles.badgesContainer}>
        {badges.map((badge, index) => {
          return <EventBadge key={index} badge={badge}/>;
        })}
        
      </div>
      
    </section>
  );
}

export default MapSection;
