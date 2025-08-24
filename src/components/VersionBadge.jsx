// Dependencies
import version from '../version.js';

// Stylesheets
import '../assets/css/components_style/VersionBadge.css';



function VersionBadge() {
  const isBeta = version.includes('beta');
  return (
    <footer style={{
      backgroundColor: isBeta ? '#FFA500' : '#4CAF50'
    }}>
      {isBeta ? `Beta ${version}` : `v${version}`}
    </footer>
  );
};

export default VersionBadge;