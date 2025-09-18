// Components
import EventBadge from './EventBadge.jsx';

// Stylesheets
import styles from './MapSection.module.css';



function MapSection({ background, paths, badges }) {
  return (
    <section className={styles.mapSection} style={{ backgroundImage: `url(${background})`}}>
      {/* ------- PATHS ------- */}
      {/* TOP PATH */}
      <div className={`${styles.path} ${styles.top}`} style={{ backgroundImage: `url(${paths[1]})`}}/>

      {/* BOTTOM PATH */}
      <div className={`${styles.path} ${styles.bottom}`} style={{ backgroundImage: `url(${paths[0]})`}}/>

      {/* ------- BADGES ------- */}
      <div className={styles.badgesContainer}>
        {badges.map(type => {
          console.log(type)
          return <EventBadge type={type}/>;
        })}
        
      </div>
      
    </section>
  );
}

export default MapSection;
