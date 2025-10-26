// Dependencies
import { useEffect, useState } from "react";
import { useStore } from "@/stores";
import * as funcs from "@/utils/functions";

// Player manager component
export function PlayerManager() {
  // Levels that the player upped at a single time
  const [levelsUpped, setLevelsUpped] = useState(0);

  // Getting the player data that the code will need
  const player = useStore("player", "actions");
  const experience = useStore("player", s => s.player.xp);
  const increases = useStore("player", s => s.player.increases);

  // Getting the other datas
  const actions = useStore("player", "instanceActions");
  const audios = useStore("audios", "actions");
  const game = useStore("game", "actions");
  const showLevelUpModal = useStore("game", s => s.game.showLevelUpModal);

  // Tries to level up the player if he's xp value change
  useEffect(() => {
    // Starting level
    const oldLevel = player.getCurrent().level;
    const newLevel = actions.tryLevelUp();
    if (newLevel) {
      // Showing the message to the terminal
      funcs.phrase('Level Up!');

      // Changing the amount of levels upped
      setLevelsUpped(newLevel - oldLevel); // the minus one is to equalize the amount of levels upped
    };
  }, [experience]);

  // useEffect to control the levelUp modal
  useEffect(() => {
    if (levelsUpped === 0) return;
    // Calling the modal to choose a perk
    game.update({ showLevelUpModal: true });
  }, [levelsUpped])

  // useEffect that works with the levelUp modal useEffect
  useEffect(() => {
    if (levelsUpped === 0) return;
    if (showLevelUpModal === true) return;

    setLevelsUpped(prev => prev - 1)
  }, [showLevelUpModal]);

  // useEffect that increment the players stats every time the increases changes
  useEffect(() => {
    player.getCurrent().incrementStats();
  }, [increases]);
  
  // Code if the player dies
  useEffect(() => {
    if (!actions.isDead()) return;

    // Phrase
    funcs.phrase("You died.");
    
    // Playing the death music:
    if (audios.getAudio("gameMusic")?.isPlaying() && !audios.getAudio("deathMusic")?.isPlaying()) {
      audios.getAudio("gameMusic")?.stop();
      audios.getAudio("deathMusic")?.start();
    }
  }, [actions.isDead()]);
  
  return null;
}
