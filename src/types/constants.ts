// Constants for some stuff
// Importing types
import { items } from "@/data/items";
import { ItemType } from "./items";

// Turns types
export const VALID_TURNS = ["player", "enemies", "onAction", null] as const;

// Events constants
export const EVENTS_TYPES = ["battle", "bossBattle"] as const;

// Items constants (DO NOT ALTER THE ORDER!)
export const ITEM_TYPES = ["weapon", "armor", "consumable", "artifact"] as const;

// Stats that are changed at the players level up
export const STATS_UPDATED_ON_LEVEL_UP = ["maxHealth", "health", "maxMana", "mana", "attack", "defense"] as const;

// Rarities
export const rarities = {
  common: {
    appearChance: 45,
    color: "green",
  },
  uncommon: {
    appearChance: 30,
    color: "blue",
  },
  rare: {
    appearChance: 15,
    color: "red",
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

// --- ITEMS / INVENTORY ---
// Weapon Ids
export type WeaponIds = keyof typeof items.weapons;
export const WEAPON_IDS = Object.keys(items.weapons) as WeaponIds[];
// Consumable Ids
export type ConsumableIds = keyof typeof items.consumables;
export const CONSUMABLE_IDS = Object.keys(items.consumables) as ConsumableIds[];
// Item Ids
export type ItemIds = WeaponIds | ConsumableIds;
export const ITEM_IDS = [...WEAPON_IDS, ...CONSUMABLE_IDS] as ItemIds[];
// Items Registry
export const ITEM_REGISTRY = Object.fromEntries(
  Object.values(items).flatMap((category) => Object.entries(category))
) as {
  [K in ItemIds]: ItemType;
};
