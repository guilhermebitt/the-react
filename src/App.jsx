// Dependencies
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useLocalStorage } from 'usehooks-ts';

// Components
import LogContainer from './components/game/LogContainer.jsx';

// Contexts
import { AppProviders } from './context/AppProviders.jsx';

// Screens
import Menu from './screens/Menu.jsx';
import Settings from './screens/Settings.jsx';
import MapScreen from './screens/MapScreen.jsx';
import BattleEvent from './screens/BattleEvent.jsx';
import Saves from './screens/Saves.jsx';
import DeathScreen from './screens/DeathScreen.jsx';
import Credits from './screens/Credits.jsx';

// Stylesheet
import './assets/css/App.css';



function App() {

  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  const [, setLastScreen] = useLocalStorage('lastScreen', '/');
  const [settings, setSettings] = useLocalStorage('settings', []);

  // Keeping the last route
  const prevLocationRef = useRef(location.pathname);

  // change the lastScreen after going to another page
  useEffect(() => {
    setLastScreen(prevLocationRef.current);
    prevLocationRef.current = location.pathname;
  }, [location])

  // when the user refreshes the page, the game back to /menu
  useEffect(() => {
    if (location.pathname !== "/menu") {
      navigate("/menu", { replace: true });
    }
  }, []); // <- só na montagem

  return (
    <>
      <Routes>
        {/* Menus */}
        <Route path="/menu" element={<Menu />} />
        <Route path="/saves" element={<Saves />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/credits" element={<Credits />} />

        {/* Game Screens */}
        <Route path="/mapscreen" element={<MapScreen />} />
        <Route path="/deathscreen" element={<DeathScreen />} />

        {/* Event Screens */}
        <Route path="/battle/*" element={<BattleEvent />} />

        {/* In Case of Page Not Found */}
        <Route path="*" element={<Menu />} />
      </Routes>
      
      {settings.showLog ? <LogContainer /> : ''}
    </>
  );
}

// Export
export default App;
