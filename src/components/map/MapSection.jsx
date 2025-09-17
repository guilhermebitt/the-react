// Stylesheets
import styles from './MapSection.module.css';



function MapSection({ background, paths, teste }) {
  return (
    <section className={styles.mapSection} style={{ backgroundImage: `url(${background})`}}>
      {/* TOP PATH */}
      <div className={`${styles.path} ${styles.top}`} style={{ backgroundImage: `url(${paths[1]})`}}/>

      {/* BOTTOM PATH */}
      <div className={`${styles.path} ${styles.bottom}`} style={{ backgroundImage: `url(${paths[0]})`}}/>
    </section>
  );
}

export default MapSection;
