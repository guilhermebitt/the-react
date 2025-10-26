// Constants for some stuff

// Turns types
export const validTurns = ["player", "enemies", "onAction", null] as const;

// Events constants
export const eventsTypes = ["battle", "bossBattle"] as const;

// Rarities
export const rarities = {
  common: {
    appearChance: 65,
    color: "blue",
  },
  uncommon: {
    appearChance: 20,
    color: "green",
  },
  rare: {
    appearChance: 10,
    color: "purple",
  },
  legendary: {
    appearChance: 5,
    color: "yellow",
  },
} as const;
