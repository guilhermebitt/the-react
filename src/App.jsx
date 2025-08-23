// Dependencies
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useLocalStorage } from 'usehooks-ts';

// Screens
import Menu from './screens/Menu.jsx';
import Settings from './screens/Settings.jsx';
import Game from './screens/Game.jsx';

// Stylesheet
import './App.css';



function App() {

  return (
    <BrowserRouter>
        <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  const [lastScreen, setLastScreen] = useLocalStorage('lastScreen', '/');

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
    <Routes>
      <Route path="/menu" element={<Menu />} />
      <Route path="/game" element={<Game />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

// Export
export default App;
