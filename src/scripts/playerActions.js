import { produce } from "immer";

// Function to reduce players life
export const attack = (setPlayer) => {
  setPlayer(produce(draft => {
    draft.stats.health -= 1;
  }));
}

// Function to send a message to the terminal
export const phrase = (setTerminalText, tag, text) => {
  const msg = `<${tag}>${text}</${tag}>`;
  text ? setTerminalText(prev => [...prev, msg]) : null;
}