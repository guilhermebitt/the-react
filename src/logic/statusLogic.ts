// Data
import rawStatusData from "@/data/status.json";
import * as funcs from "../utils/functions";

// Dependencies
import { useStore } from "@/stores";
import { useEffect, useState, useMemo } from "react";

// Types
import { OnRoundEnd, Status, StatusKey, StatusUnion } from "@/types";
import { Entity } from "@/utils/entities";
import { stat } from "node:fs/promises";

interface descKeys {
  [key: string]: any;
}

// Conversion of JSON to types
const statusData = rawStatusData as unknown as { [key: string]: Status };

// Functions that handle the context dependencies
export function useStatusLogic() {
  const [firstLoad, setFirstLoad] = useState(true);
  // Stores
  const player = useStore("player", "actions");
  const game = useStore("game", "actions");

  useEffect(() => {
    setFirstLoad(false);
  }, []);

  // Functions
  const functions = {
    // Function that add a perk to the perks object of game data
    createStatus(statusKey: StatusKey, stack : number) {
      // Variable that holds the new perk
      let newStatus = structuredClone(statusData[statusKey]);

      // Checks if the game already have this perk
      if (Object.keys(player.getCurrent().status).includes(statusKey)) {
        // First of all, gets the perk from the game data
        const prevStatus = player.getCurrent().status[statusKey];
        // Gets the new counting of the perks, after checking if it reached the limit of stacks
        if (prevStatus.stackCount < prevStatus.maxStackCount) {
          // Updating the stack count
          newStatus.stackCount = prevStatus.stackCount + stack;
          if (newStatus.stackCount > newStatus.maxStackCount) newStatus.stackCount = newStatus.maxStackCount;

          // Updating the newPerk increases
          const updatedStatus = functions.updateStatus(newStatus);

          // Checking if the perk was updated
          if (!updatedStatus)
          player.update({
            status: (prev: any) => {
                return { ...prev, [statusKey]: newStatus };
              },
            });
          else
          player.update({
            status: (prev: any) => {
                return { ...prev, [statusKey]: updatedStatus };
              },
            });
        } else {
          // Maintain the perk intact
          console.log("Status reached the max stack count");
          return game.update({
            status: (prev: any) => {
              return { ...prev, [statusKey]: prevStatus };
            },
          });
        }
      }
      else
      {
        newStatus.stackCount = stack;
        functions.updateStatus(newStatus);
      }

      // Adding the perk to the game
      player.update({
        status: (prev: any) => {
          return { ...prev, [statusKey]: newStatus };
        },
      });

      console.log(this.createDescription(newStatus.description, newStatus.translates));
    },

    // Function that updates a perk increments based on its stacks
    updateStatus(status: StatusUnion): StatusUnion | void {
      // Checks if the perk has an increases attribute (not needed)
      //if (!perk.effects?.increases) return console.warn("⚠️ perk does not have an increases attribute.");

      // newPerk variable
      let newStatus = status;

      if (status.translates.stackCount !== undefined) 
      {
        // Incrementing its stack value
        newStatus.translates.stackCount = newStatus.stackCount;
      }

      if (status.fixed == "fixed")
      {
        return newStatus;
      }

      if (status.effects.onRoundEnd !== undefined) 
      {
        // Traveling between the perk increases
        for (const [incKey, incValue] of Object.entries(status.effects.onRoundEnd)) {
          if (!newStatus.effects.onRoundEnd?.[incKey]) continue;

          // Incrementing its increment value
          newStatus.effects.onRoundEnd[incKey] = incValue * newStatus.stackCount;
        }

        for (const [incKey, incValue] of Object.entries(status.translates)) {
          if (!newStatus.translates?.[incKey]) continue;

          if (incKey == "decreaseStack" || incKey == "stackCount") continue;

          // Incrementing its increment value
          newStatus.translates[incKey] = incValue * newStatus.stackCount;
        }
      }

      // Returning the updated perk
      return newStatus;
    },

    removeStatus(statusKey: StatusKey) {
      const currentStatus = player.getCurrent().status[statusKey];
      if (!currentStatus) return;
    
      this.createStatus(statusKey, -currentStatus.decreaseStack);
    
      if (currentStatus.stackCount <= 1) {
        player.update({
          status: (prev) => {
            const { [statusKey]: _, ...rest } = prev;
            return rest;
          },
        });
      }
    },

    // Function that runs everytime the round ends
    updateStatusOnRoundEnd() {
      const statuses = player.getCurrent().status;
    
      for (const [, status] of Object.entries(statuses)) {
        const onRoundEnd = status.effects.onRoundEnd;
        if (!onRoundEnd) continue;
    
        if (typeof onRoundEnd.health === "number") {
          player.update({
            ["stats.health"]:
            player.getCurrent().stats.health - onRoundEnd.health < 0 ? 0 : player.getCurrent().stats.health - onRoundEnd.health,
          });
        }

        funcs.phrase("Player took " + onRoundEnd.health + " " + status.category + " damage", "lightgreen");
    
        // IMPORTANT: pass the ID (key), not the whole object
        this.removeStatus(status.id);
      }
    },

    // Function that runs everytime the round ends but only activates when stack reaches 0
    updateStatusOnRoundEndTimer() {
      const statuses = player.getCurrent().status;
    
      for (const [, status] of Object.entries(statuses)) {
        const onRoundEnd = status.effects.onRoundEndTimer;
        if (!onRoundEnd) continue;

        // IMPORTANT: pass the ID (key), not the whole object
        this.removeStatus(status.id)

        let timer = player.getCurrent().status[status.id];
        console.log(timer)
        
        if (timer !== undefined) continue;

        if (typeof onRoundEnd.health === "number") {
          player.update({
            ["stats.health"]:
              player.getCurrent().stats.health - onRoundEnd.health < 0 ? 0 : player.getCurrent().stats.health - onRoundEnd.health,
          });
        }

        funcs.phrase("Player took " + onRoundEnd.health + " " + status.category + " damage", "lightgreen");
      }
    },

    // Functions that updates the description of a perk with the values that it have
    createDescription(desc: string, keys: descKeys) {
      const result = desc.replace(/\{(\w+)\}/g, (_, key) => keys[key]);

      return result;
    },
  };

  return useMemo(() => ({ ...functions }), []);
}
