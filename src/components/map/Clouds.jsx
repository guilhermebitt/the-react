// Stylesheets
import styles from './Clouds.module.css';



function Clouds({ type, following = false }) {
  if (type === "starting") return (
    <div className={styles.container}>
      
      <img className={styles.cloud} src="/assets/map_sections/clouds/cloud_1.png" alt="cloud" />
      <img className={styles.cloud} src="/assets/map_sections/clouds/cloud_2.png" alt="cloud" />
      <img className={styles.cloud} src="/assets/map_sections/clouds/cloud_3.png" alt="cloud" />
    </div>
  );
  if (type === "full") return (
    <div className={styles.container}>
      <img className={`${styles.cloud} ${!following && styles.notFollowing}`} src="/assets/map_sections/clouds/cloud_full.png" alt="cloud" />
    </div>
  );
}

export default Clouds;
