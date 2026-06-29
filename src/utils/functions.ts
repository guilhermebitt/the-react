// Dependencies
import { useGameStore } from "@/stores";
// Data
import mapsJson from "../data/maps.json";
const maps: object | any = mapsJson;

// Custom interface for ponderable objects
interface Ponderable {
  // All ponderable objects must have an appearChance
  appearChance: number;

  // All other keys can be any
  [key: string]: any;
};

// ----- FUNCTIONS -----

// Function to send a message to the terminal
// creating an external variable for the messages queue
const msgQueue: string[] = [];
export function phrase(text: string,  color: string = "white", tag: string = "p", className: string = "default-msg") {
  // Creating the message prompt
  const msg = `<${tag} className="${className}" style="color:${color}">${text}</${tag}>`;

  // Adding the message to the queue
  msgQueue.push(msg);

  // Calling the function to update the terminal
  scheduleTerminalUpdate();
}

let updateScheduled = false;
function scheduleTerminalUpdate() {
  // Getting the game data
  const {game, update} = useGameStore.getState();

  // Won't continue the code if the function is scheduling
  if (updateScheduled) return;
  updateScheduled = true;

  // Defers the update to the next JavaScript "tick".
  // This is important because JS runs code in a single-threaded event loop.
  // If phrase() is called multiple times in quick succession, each call would
  // read terminalText before the previous update is applied. Using setTimeout(..., 0)
  // batches all messages in the queue and updates the terminal once, preventing
  // newer messages from overwriting previous ones.
  setTimeout(() => {
    const prevTerminal = game.terminalText;
    const prevLog = game.logText;

    // Joins everything in an unique array
    const newTerminal = [...prevTerminal, ...msgQueue];
    const newLog = [...prevLog, ...msgQueue];

    // Clear the queue and unlocks the scheduled flow
    msgQueue.length = 0;
    updateScheduled = false;

    // Updates the game state
    update({ terminalText: newTerminal });
    update({ logText: newLog });
  }, 0);
}

// Cleaning the localStorage
export function clearStorage(toKeep: string[]) {
  const storageKeys = Object.keys(localStorage); // saving the keys before remove since the length of storages changes

  storageKeys.forEach((key) => {
    if (!toKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });
}

// Getting the current map the player is
export function getCurrentMap(): any {
  // Getting the game data
  const {game} = useGameStore.getState();
  
  if (game.currentMap) {
    return maps[game.currentMap];
  } else {
    return console.error("Game was no map at getCurrentMap() function")
  }
}

// Get the tick and returns the time in format HH:MM:SS
export function tickToTime(ticks: number, tickSpeed: number) {
  const ticksPerSecond = 1000 / tickSpeed;

  const seconds = Math.floor(ticks / ticksPerSecond);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${padZero(hours % 60)}h ${padZero(minutes % 60)}m ${padZero(seconds % 60)}s`;
}

// Returns a number in format 00
export function padZero(number: number) {
  return (number < 10 ? "0" : "") + number;
}

// Generates a random number
export function random(max: number, min: number = 0) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return min + (array[0] % (max + 1 - min));
}

// Creates the ponderedChance of an array of objects with appearChance
export function ponderedChance(PonderableArray: { [key: string]: Ponderable }): [string, Ponderable] | null {
  // Converts the entries of the array to [key, value]
  let arrayEntries = structuredClone(Object.entries(PonderableArray));

  for (const item of arrayEntries) {
    // If the obj appearChance is equals to 0, skip this for
    if (item[1]?.appearChance === 0) continue;

    // If the obj does not have an appearChance, returns
    if (!item[1]?.appearChance) {
      console.warn("⚠️ obj of array in ponderedChance() does not have an appearChance.");
      return null;
    }
  }

  // Sorting the array
  const sortedArray = structuredClone(arrayEntries).sort((a, b) => b[1].appearChance - a[1].appearChance);

  // Variable to storage sum of all chances
  const totalChance = sortedArray.reduce((acc, [, obj]) => acc + obj.appearChance, 0);

  // Generating the roll random number
  const roll = random(totalChance);
  let cumulative = 0;

  for (const [key, obj] of sortedArray) {
    cumulative += obj.appearChance;
    //console.log("Object:", key, "Roll:", roll, "Cumulative:", cumulative);
    if (roll <= cumulative) return [key, obj];
  }

  // Just in case that something went wrong
  return ponderedChance(PonderableArray);
}