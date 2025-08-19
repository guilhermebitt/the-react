// Dependencies
import { produce } from "immer";



// Function to send a message to the terminal
export function phrase(setTerminalText, tag, text, className) {
  const msg = `<${tag} className="${className ? className : "default-msg"}">${text}</${tag}>`;
  if (text) setTerminalText(prev => [msg, ...prev]);
}

// Function to handle turn changes
export function turnHandler(setGame, turn) {
  setGame(produce(draft => {
    draft.currentTurn = turn;
  }));
}
