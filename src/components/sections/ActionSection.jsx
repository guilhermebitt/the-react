// Dependencies
import * as funcs from "../../utils/functions";
import { useState, memo, useCallback } from "react";

// Components
import ActionButtons from "../common/ActionButtons";
import Terminal from "../game/Terminal";
import Stats from "../ui/Stats";
import ConfirmDialog from "../common/ConfirmDialog";

// Hooks
import { useLogic } from "@/hooks";
import { useStore } from "@/stores";
import { usePerkLogic } from "@/logic/usePerkLogic";

// Stylesheet
import styles from "./sections.module.css";

function ActionSection() {
  const logic = useLogic();
  const { createPerk } = usePerkLogic();
  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    message: "Are you sure?",
    onConfirm: null,
    onCancel: null,
  });
  // Stores
  const playerActions = useStore("player", "actions");
  const enemiesActions = useStore("enemies", "actions");
  const game = useStore("game", "actions");

  // Function to realize an attack
  const doAttack = useCallback(() => {
    // Conditions
    if (game.getCurrent().currentTurn !== "player") return;
    if (typeof game.getCurrent().target !== "number") return funcs.phrase("Select a target!");
    if (playerActions.getCurrent().actionsLeft <= 0)
      return funcs.phrase("You do not have actions left! End your turn.");
    if (enemiesActions.getCurrent(game.getCurrent().target)?.currentAnim === "death")
      return funcs.phrase("This enemy is dead.");

    const { attackMsg, timeToWait, loot, isDead } = playerActions
      .getCurrent()
      .attack(enemiesActions.getCurrent(game.getCurrent().target)); // this function executes an attack and return some data
    if (isDead) game.update({ "eventData.kills": (prev) => prev + 1 });

    // Changing the turn
    const lastTurn = game.getCurrent().currentTurn;
    game.update({ currentTurn: "onAction" });

    setTimeout(() => {
      game.update({ currentTurn: lastTurn });
    }, timeToWait);
    // ------------------

    funcs.phrase(attackMsg); // showing the result of the attack
    loot?.experience && funcs.phrase(`You gained ${loot.experience} points of experience.`);
    playerActions.update({ actionsLeft: (prev) => prev - 1 });
  }, []);

  const confirmScreen = useCallback((onConfirm, onCancel, msg = "Are you sure?") => {
    setConfirmDialog({
      visible: true,
      message: msg,
      onConfirm: onConfirm || (() => {}),
      onCancel: onCancel || (() => setConfirmDialog((prev) => ({ ...prev, visible: false }))),
    });
  }, []);

  // Returning the section
  return (
    <div className={styles.actSecContainer}>
      {/* Confirm dialog */}
      <ConfirmDialog
        visible={confirmDialog.visible}
        message={confirmDialog.message}
        onConfirm={() => {
          confirmDialog.onConfirm?.();
          setConfirmDialog((prev) => {
            return { ...prev, visible: false };
          });
        }}
        onCancel={() => {
          confirmDialog.onCancel?.();
          setConfirmDialog((prev) => {
            return { ...prev, visible: false };
          });
        }}
      />

      {/* Rest of the component */}
      <ActionButtons
        attack={doAttack}
        changeAnim={null}
        sendMsg={() => createPerk("critEye")}
        endTurn={() =>
          game.getCurrent().currentTurn === "player" &&
          confirmScreen(() => {
            logic.switchTurn();
          })
        }
      />
      <Terminal />
      <Stats />
    </div>
  );
}

export default memo(ActionSection);
