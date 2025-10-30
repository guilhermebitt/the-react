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
