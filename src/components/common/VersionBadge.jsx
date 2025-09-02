// Dependencies
import version from '../../utils/version.js';

// Stylesheets
import styles from './VersionBadge.module.css';



function VersionBadge() {
  const isBeta = version.includes('beta');
  return (
    <div className={styles.versionContainer} style={{
      backgroundColor: isBeta ? '#FFA500' : '#4CAF50'
    }}>
      {isBeta ? `Beta ${version}` : `v${version}`}
    </div>
  );
};

export default VersionBadge;