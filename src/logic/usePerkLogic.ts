// Data
import playerJson from "@/data/player.json"
import rawPerksData from "@/data/perks.json"

// Dependencies
import { useGame } from "@/hooks";
import { useEffect, useMemo, useState } from "react";

// Types
import { Increases, Perk, PerksKey, PerkUnion } from "@/types";

interface descKeys {
  [key: string]: any;
}

// Conversion of JSON to types
const perksData = rawPerksData as unknown as {[key: string]: Perk}

// Functions that handle the context dependencies
export function usePerkLogic() {
  const { player, game } = useGame();
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {setFirstLoad(false)}, [])

  // Updating the player increments
  useEffect(() => {
    if (firstLoad) return;

    functions.updatePlayerIncreases()
  }, [game.get().perks])

  // Functions
  const functions = {
    // Functions that add a perk to the perks object of game data
    createPerk(perkKey: PerksKey) {
      // Variable that holds the new perk
      let newPerk = structuredClone(perksData[perkKey]);

      // Checks if the game already have this perk
      if (Object.keys(game.get().perks).includes(perkKey)) {
        // First of all, gets the perk from the game data
        const prevPerk = game.get().perks[perkKey]
        // Gets the new counting of the perks, after checking if it reached the limit of stacks
        if (prevPerk.stackCount < prevPerk.maxStackCount) {
          // Updating the stack count
          newPerk.stackCount = prevPerk.stackCount + 1;

          // Updating the newPerk increases
          const updatedPerk = functions.updatePerkIncreases(newPerk);

          // Checking if the perk was updated
          if (!updatedPerk) game.update({ perks: prev => {return {...prev, [perkKey]: newPerk}} });
          else game.update({ perks: prev => {return {...prev, [perkKey]: updatedPerk}} });
        } else {
          // Maintain the perk intact
          console.log("Perk reached the max stack count")
          return game.update({ perks: prev => {return {...prev, [perkKey]: prevPerk}} })
        }
      }

      // Adding the perk to the game
      game.update({ perks: prev => {return {...prev, [perkKey]: newPerk}} })
    },

    // Functions that updates a perk increments based on its stacks
    updatePerkIncreases(perk: PerkUnion): PerkUnion | void {
      // Checks if the perk has an increases attribute
      if (!perk.effects?.increases) return console.warn("⚠️ perk does not have an increases attribute.");

      // newPerk variable
      let newPerk = perk;

      // Traveling between the perk increases
      for (const [incKey, incValue] of Object.entries(perk.effects.increases)) {
        if (!newPerk.effects.increases?.[incKey]) continue;

        // Incrementing its increment value
        newPerk.effects.increases[incKey] = (incValue * newPerk.stackCount);
      }

      // Returning the updated perk
      return newPerk;
    },

    // Function that updates the player increases object with all perks increases
    updatePlayerIncreases() {
      // Resets the player increases
      player.update({ increases: {} });

      // For thats navigates between all perks of game data
      for (const [, perk] of Object.entries(game.get().perks)) {
        // Catch the increases object of the perk
        const increases = perk["effects"]["increases"];

        // Another for that navigates between the increases object
        for (const [key, value] of Object.entries(increases as Increases)) {

          // Checks if the increase key is equals to a player stat
          if (Object.keys(playerJson.stats).includes(key)) {
            // Finally, adds the increase to the player's increases
            player.update({ increases: (prev: any) => {return {...prev, [key]: value}} });
          }
        }
      }
    },

    // Functions that updates the description of a perk with the values that it have
    createDescription(desc: string, keys: descKeys) {
      const result = desc.replace(/\{(\w+)\}/g, (_, key) => keys[key]);

      return result;
    }
  };

  return { ...functions };
}
