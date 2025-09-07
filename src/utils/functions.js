// Data
import maps from '../data/maps.json' with { type: 'json' }



// ----- HOOKS MANAGER -----
let game;

export function init(gameState) {
  game = gameState;
}



// ----- FUNCTIONS -----
// Function to send a message to the terminal
// creating an external variable for the messages queue
const msgQueue = [];
export function phrase(text, tag="p", className="default-msg") {
  if (!game) return;

  // Creating the message prompt
  const msg = `<${tag} className="${className}">${text}</${tag}>`;

  // Adding the message to the queue
  msgQueue.push(msg);

  // Calling the function to update the terminal
  scheduleTerminalUpdate()
}

let updateScheduled = false;
function scheduleTerminalUpdate() {
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
    const prevTerminal = game.get().terminalText

    // Joins everything in an unique array
    const newTerminal = [...prevTerminal, ...msgQueue];

    // Clear the queue and unlocks the scheduled flow
    msgQueue.length = 0;
    updateScheduled = false;

    // Updates the game state
    game.update({ terminalText: newTerminal });
  }, 0);
}

// Function to handle turn changes
export function endTurn() {
  if (!game) return;
  game.update({ currentTurn: 'enemies' })
  game.update({ specificEnemyTurn: 0 })
}

// Cleaning the localStorage
export function clearStorage(toKeep) {
  const storageKeys = Object.keys(localStorage);  // saving the keys before remove since the length of storages changes

  storageKeys.forEach(key => {
    if (!toKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  })
}

// Getting the current map the player is
export function getCurrentMap() {
  return maps[game.get().currentMap];
}