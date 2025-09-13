// Dependencies
import version from '../../utils/version.js';

// Stylesheets
import styles from './VersionBadge.module.css';



function VersionBadge() {
  const isBeta = version.includes('beta');
  return (
    <div className={styles.versionContainer}>
      {isBeta ? `Beta ${version}` : `v${version}`}
    </div>
  );
};

export default VersionBadge;