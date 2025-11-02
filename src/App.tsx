// Dependencies
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useLocalStorage } from "usehooks-ts";

// Components
import LogContainer from "./components/game/LogContainer";

// Managers
import { AudioManager, PlayerManager, EnemiesManager } from "@/managers";

// Logics
import { BattleEventLogic } from "@/logic";

// Screens
import Menu from "./screens/Menu";
import Settings from "./screens/Settings";
import MapScreen from "./screens/MapScreen";
import BattleEvent from "./screens/BattleEvent";
import Saves from "./screens/Saves";
import DeathScreen from "./screens/DeathScreen";
import Credits from "./screens/Credits";

// Stylesheet
import "./assets/css/App.css";

function App() {
  return (
    <BrowserRouter>
      <Managers />
      <Logics />
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setLastScreen] = useLocalStorage("lastScreen", "/");
  const [settings] = useLocalStorage("settings", {showLog: false});

  // Keeping the last route
  const prevLocationRef = useRef(location.pathname);

  // change the lastScreen after going to another page
  useEffect(() => {
    setLastScreen(prevLocationRef.current);
    prevLocationRef.current = location.pathname;
  }, [location]);

  // when the user refreshes the page, the game back to /menu
  useEffect(() => {
    if (location.pathname !== "/menu" && location.pathname !== "/") {
      //navigate("/menu", { replace: true });
      navigate("/menu", { replace: true });
    }
  }, []);

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

      {settings.showLog && <LogContainer />}
    </>
  );
}

// Game Managers
function Managers() {
  return (
    <>
      <AudioManager />
      <PlayerManager />
      <EnemiesManager />
    </>
  );
}

// Game Logics
function Logics() {
  return (
    <>
      <BattleEventLogic />
    </>
  )
}

// Export
export default App;
