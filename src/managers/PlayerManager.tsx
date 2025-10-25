// Dependencies
import { useEffect } from "react";
import { useStore } from "@/stores";

// Player manager component
export function PlayerManager() {
  // Getting the player data that the code will need
  const player = useStore("player", "actions");
  const experience = useStore("player", s => s.player.xp);
  const increases = useStore("player", s => s.player.increases);

  // Getting the player actions
  const actions = useStore("player", "instanceActions");
  const audios = useStore("audios", "actions");

  useEffect(() => {
    player.getCurrent().incrementStats();
  }, [increases])

  // Tries to level up the player if he's xp value change
  useEffect(() => {
    const result = actions.tryLevelUp();
    //if (result) phrase('Level Up!')
  }, [experience]);
  
  // Code if the player dies
  useEffect(() => {
    if (!actions.isDead()) return;

    // Phrase
    //phrase("You died.");
    
    // Playing the death music:
    if (audios.getAudio("gameMusic")?.isPlaying() && !audios.getAudio("deathMusic")?.isPlaying()) {
      audios.getAudio("gameMusic")?.stop();
      audios.getAudio("deathMusic")?.start();
    }
  }, [actions.isDead()]);
  
  return null;
}
