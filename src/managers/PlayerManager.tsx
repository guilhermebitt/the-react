// Dependencies
import { useEffect, useMemo } from "react";
import { useStore } from "@/stores";

// Player manager component
export function PlayerManager() {
  // Getting the player data that the code will need
  const player = useStore("player", s => ({increases: s.player.increases, xp: s.player.xp}));

  // Getting the player actions
  const actions = useStore("player", "instanceActions");
  const audiosActions = useStore("audios", "actions");

  // Tries to level up the player if he's xp value change
  useEffect(() => {
    const result = actions.tryLevelUp();
    //if (result) phrase('Level Up!')
  }, [player.xp]);
  
  // Code if the player dies
  useEffect(() => {
    if (!actions.isDead()) return;

    // Phrase
    //phrase("You died.");
    
    // Playing the death music:
    if (audiosActions.getAudio("gameMusic")?.isPlaying() && !audiosActions.getAudio("deathMusic")?.isPlaying()) {
      audiosActions.getAudio("gameMusic")?.stop();
      audiosActions.getAudio("deathMusic")?.start();
    }
  }, [actions.isDead()]);
  
  return null;
}
