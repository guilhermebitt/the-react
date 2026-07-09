// Importing constants
import { ARMOR_TYPES, ITEM_TYPES } from "@/types/constants"
import { Rarity } from "./global";

// Exporting types
export type ItemType = Weapon | Shield | Armor | Consumable | Charm;
export type ArmorType = Helmet | Chestplate | Legging | Boots;

// Type for item object
type Item = {  // Base for all items
  id: string
  name: string
  description: string
  subDescription?: string
  imagePath: string

  rarity: Rarity

  stackable: boolean
  maxStack?: number
}

// WEAPON
type Weapon = Item & {
  type: typeof ITEM_TYPES[0]
  damage: number,
  multiplier: number
}

// WEAPON
type Armor = Item & {
  type: typeof ITEM_TYPES[1]
  subtype: typeof ARMOR_TYPES,
  defense: number
}

// CONSUMABLE
type Consumable = Item & {
  type: typeof ITEM_TYPES[2]
}

// SHIELD
type Shield = Item & {
  type: typeof ITEM_TYPES[3]
  defense: number
} 