// Dependencies
import { useEffect, useState } from "react";
import { useStore } from "@/stores";
import * as funcs from "@/utils/functions";
import playerJson from "@/data/player.json";
import { Increases, PlayerData, Stats } from "@/types";
import { STATS_UPDATED_ON_LEVEL_UP } from "@/types/constants";

// Setting up the player data
const playerData = playerJson as unknown as PlayerData

// Player manager component
export function PlayerManager() {
  // Levels that the player upped at a single time
  const [levelsUpped, setLevelsUpped] = useState(0);

  // Getting the player data that the code will need
  const player = useStore("player", "actions");
  const experience = useStore("player", s => s.player.xp);
  const increases = useStore("player", s => s.player.increases);
  const onKill = useStore("player", s => s.player.onKill);

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

      // Calling the function to update the stats
      updateStats();
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
    // Calling the function to update the stats
    updateStats();
  }, [increases, onKill]);
  
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

  // Function that controls the stats of the player, so when the player levelup,
  // this function will be called, when the player get a perk, this function will be called.
  const updateStats = () => {
    // Getting the base stats
    const baseStats = playerData.stats;
    const playerStats = player.getCurrent().stats;

    // Saving the difference of stat / maxStat
    // ⚠️ THIS WILL REGENERATE THOSE STATS BY THE AMOUNT LEVEL UPPED
    const statsDifference = {
      health: playerStats.maxHealth - playerStats.health,
      mana: playerStats?.mana && (playerStats.maxMana as any - playerStats.mana) || 0
    };

    // Traveling for each stat of the player:
    // key = stat name | value = value of the stat
    for (const [key, value] of Object.entries(baseStats)) {
      // Defining the base value of the stat
      let newStatValue = value as number;
      
      // Now, verifies if the stat changes on levelup
      if (STATS_UPDATED_ON_LEVEL_UP.includes(key as any)) {
        // Adding the difference between the base value and the levelup value
        newStatValue += actions.getLevelUpStat(key as keyof Stats);
      }

      // Checking if the player has any increases for that stat, if not, skips this for run
      if (Object.keys(increases).includes(key)) {
        // Adding the increase to the stat
        newStatValue += increases[key as keyof Increases];
      };
      
      // Setting the new stat dotted path
      const newStatKey = `stats.${key}`;

      // Removing the difference
      if (Object.keys(statsDifference).includes(key)) newStatValue -= (statsDifference as any)[key]

      // Updating the player stat
      player.update({[newStatKey]: newStatValue});
    }
  }

  return null;
}
