// Dependencies
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { AnimatePresence, motion } from 'framer-motion';

// Contexts
import { AppProviders } from './context/AppProviders.jsx';

// Screens
import Menu from './screens/Menu.jsx';
import Settings from './screens/Settings.jsx';
import BattleEvent from './screens/BattleEvent.jsx';
import Saves from './screens/Saves.jsx';
import DeathScreen from './screens/DeathScreen.jsx';

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
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/menu" element={<PW><Menu /></PW>} />
        <Route path="/saves" element={<PW><Saves /></PW>} />
        <Route path="/battle/*" element={<PW><BattleEvent /></PW>} />
        <Route path="/settings" element={<PW><Settings /></PW>} />
        <Route path="/deathscreen" element={<PW><DeathScreen /></PW>} />
      </Routes>
    </AnimatePresence>
  );
}

function PW({ children }) {  // PW -> PageWrapper
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}   // starts invisible and a little to the right
      animate={{ opacity: 1, x: 0 }}   // enters smoothly
      exit={{ opacity: 0, x: -50 }}    // exit to the left
      transition={{ duration: 0.05, ease: "linear" }}
      className="page-wrapper"
    >
      {children}
    </motion.div>
  );
}

// Export
export default App;
