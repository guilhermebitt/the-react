// Data
import settingsData from "../../data/settings.json";

// Dependencies
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { produce } from "immer";

// Components
import ComponentBorder from "../ui/ComponentBorder";
import ConfirmDialog from "./ConfirmDialog";

// Hooks
import { useStore } from "@/stores";
import { useSaveManager } from "../../hooks/useSaveManager";

// Stylesheet
import styles from "./OptionButtons.module.css";

function OptionButtons() {
  // Stores
  const game = useStore("game", "actions");
  const { saveGame } = useSaveManager(game.getCurrent().currentSave);
  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    message: "Are you sure?",
    onConfirm: null,
    onCancel: null,
  });
  const [ShowLastCScreen, setShowLastCScreen] = useState(false);
  const [, setSettings] = useLocalStorage("settings", settingsData);

  useEffect(() => {
    if (!ShowLastCScreen) return;
    confirmScreen(null, null, "Game Saved!");
    setShowLastCScreen(false);
  }, [ShowLastCScreen]);

  function confirmScreen(onConfirm, onCancel, msg = "Are you sure?") {
    setConfirmDialog({
      visible: true,
      message: msg,
      onConfirm: onConfirm || (() => {}),
      onCancel: onCancel,
    });
  }

  function showLog() {
    setSettings(
      produce((draft) => {
        draft.showLog = true;
      })
    );
  }

  return (
    <>
      <ConfirmDialog
        visible={confirmDialog.visible}
        message={confirmDialog.message}
        onConfirm={
          confirmDialog.onConfirm &&
          (() => {
            confirmDialog.onConfirm?.();
            setConfirmDialog((prev) => {
              return { ...prev, visible: false };
            });
          })
        }
        onCancel={
          confirmDialog.onCancel &&
          (() => {
            confirmDialog.onCancel?.();
            setConfirmDialog((prev) => {
              return { ...prev, visible: false };
            });
          })
        }
      />
      <ComponentBorder title="Options">
        <div className={styles["options-menu-container"]}>
          <button className="default" onClick={showLog} disabled={!(game.getCurrent().currentTurn === "player")}>
            Log
          </button>
          <Link to="/settings">
            <button className="default" disabled={!(game.getCurrent().currentTurn === "player")}>
              Settings
            </button>
          </Link>
          <Link to="/menu">
            <button className="default" disabled={!(game.getCurrent().currentTurn === "player")}>
              Menu
            </button>
          </Link>
          <button
            className="default"
            onClick={() => {
              confirmScreen(
                () => {
                  saveGame();
                  setShowLastCScreen(true);
                },
                () => setConfirmDialog((prev) => ({ ...prev, visible: false }))
              );
            }}
            disabled={!(game.getCurrent().currentTurn === "player")}>
            Save Game
          </button>
        </div>
      </ComponentBorder>
    </>
  );
}

export default OptionButtons;
