// Dependencies
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

// Stylesheet
import '../assets/css/screens_style/menus.css';

function Settings() {

  // Getting the lastScreen from localStorage
  const [lastScreen, setLastScreen] = useLocalStorage('lastScreen');

  return (
    <main>
      <h1>Settings</h1>
      <button>Option1</button>
      <Link to={lastScreen}>
        <button>Back</button>
      </Link>
    </main>
  );
}

export default Settings;
