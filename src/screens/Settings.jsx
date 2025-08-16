// Dependencies
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { useEffect } from 'react';

// Stylesheet
import '../assets/css/screens_style/menus.css';

function Settings() {

  // Getting the lastScreen from localStorage
  const [lastScreen, setLastScreen] = useLocalStorage('lastScreen', '/');

  useEffect(() => {
    if (lastScreen === '/settings') {
      setLastScreen('/');
    }
  });

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
