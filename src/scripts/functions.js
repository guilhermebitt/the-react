// Dependencies
import { produce } from "immer";



// Function to reduce enemy's life
export function attack(setEnemy, currentTurn) {
  if (currentTurn === "player") {
    setEnemy(produce(draft => {
      draft.stats.health -= 1;
    }));
  }
}

// Function to send a message to the terminal
export function phrase(setTerminalText, tag, text) {
  const msg = `<${tag}>${text}</${tag}>`;
  if (text) setTerminalText(prev => [...prev, msg]);
}

// Function to handle turn changes
export function turnHandler(setCurrentTurn, turn) {
  setCurrentTurn(turn);
}