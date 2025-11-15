// Constants for some stuff

// Turns types
export const VALID_TURNS = ["player", "enemies", "onAction", null] as const;

// Events constants
export const EVENTS_TYPES = ["battle", "bossBattle"] as const;

// Stats that are changed at the players level up
export const STATS_UPDATED_ON_LEVEL_UP = ["maxHealth", "health", "maxMana", "mana", "attack", "defense"] as const;

// Rarities
export const rarities = {
  common: {
    appearChance: 45,
    color: "red",
  },
  uncommon: {
    appearChance: 30,
    color: "blue",
  },
  rare: {
    appearChance: 15,
    color: "green",
  },
  epic: {
    appearChance: 8,
    color: "purple",
  },
  legendary: {
    appearChance: 2,
    color: "yellow",
  },
} as const;
