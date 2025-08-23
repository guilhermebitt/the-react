// Dependencies
import { produce } from "immer";



// ----- HOOKS MANAGER -----
let terminal;
let game;

export function init(setTerminalText, setGame) {
  terminal = setTerminalText;
  game = setGame;
}



// ----- FUNCTIONS -----
// Function to send a message to the terminal
export function phrase(text, tag="p", className="default-msg") {
  if (!terminal) return;

  // Get terminal as an array
  const prevTerminal = JSON.parse(localStorage.getItem('terminalText') || "[]");

  // Creating the message prompt
  const msg = `<${tag} className="${className}">${text}</${tag}>`;

  // Adding it to the start of the terminal
  const updatedTerminal = [msg, ...prevTerminal];

  // Saves to the localStorage
  localStorage.setItem('terminalText', JSON.stringify(updatedTerminal));

  // Updates the terminal state
  terminal(updatedTerminal);
}

// Function to handle turn changes
export function turnHandler(turn) {
  if (!game) return;
  game(produce(draft => {
    draft.currentTurn = turn;
  }));
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