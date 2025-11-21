// Data
import settingsData from "../../data/settings.json";

// Dependencies
import { Link } from "react-router-dom";
import { useState, useEffect, memo } from "react";
import { useLocalStorage } from "usehooks-ts";
import { produce } from "immer";

// Components
import ComponentBorder from "../ui/ComponentBorder";

// Hooks
import { useStore } from "@/stores";
import { useSaveManager } from "../../hooks/useSaveManager";
import { useConfirmDialog } from "@/hooks";

// Stylesheet (Not Entirely sur3e this is needed anymore)
import styles from "./OptionButtons.module.css";

function OptionButtons() {
  // Stores
  const currentTurn = useStore("game", (s) => s.game.currentTurn);
  const currentSave = useStore("game", (s) => s.game.currentSave);
  const { saveGame } = useSaveManager(currentSave);
  const [CDComponent, confirm] = useConfirmDialog();
  const [CDComponent2, confirm2] = useConfirmDialog(1);
  const [, setSettings] = useLocalStorage("settings", settingsData);

  function showLog() {
    setSettings(
      produce((draft) => {
        draft.showLog = true;
      })
    );
  }

  function showBestiary() {
    setSettings(
      produce((draft) => {
        draft.showBestiary = true;
      })
    );
  }

  const handleSaveGame = async () => {
    const result = await confirm("Do you want to overwrite your save? This action cannot be undone.");
    if (result) {
      saveGame();
      showLastCScreen();
    }
  };

  const showLastCScreen = async () => {
    const result = await confirm2("Game saved!");
  }

  return (
    <>
      {CDComponent}
      {CDComponent2}
      <ComponentBorder title="Options">
        <div className="options-menu-container">
          <button className="default" onClick={showLog} disabled={!(currentTurn === "player")}>
            Log
          </button>
          <button className="default" onClick={showBestiary} disabled={!(currentTurn === "player")}>
            Bestiary
          </button>
          <Link to="/settings">
            <button className="default" disabled={!(currentTurn === "player")}>
              Settings
            </button>
          </Link>
          <Link to="/menu">
            <button className="default" disabled={!(currentTurn === "player")}>
              Menu
            </button>
          </Link>
          <button className="default" onClick={handleSaveGame} disabled={!(currentTurn === "player")}>
            Save Game
          </button>
        </div>
      </ComponentBorder>
    </>
  );
}

export default memo(OptionButtons);
