// Importing constants
import { ITEM_TYPES } from "@/types/constants"
import { Rarity } from "./global";

// Exporting types
export type ItemType = Item | Weapon | Consumable;

// Type for item object
type Item = {  // Base for all items
  id: string
  name: string
  description: string
  imagePath: string

  rarity: Rarity

  stackable: boolean
  maxStack?: number
}

// WEAPON
type Weapon = Item & {
  type: typeof ITEM_TYPES[0]
  baseDamage: number
}

// CONSUMABLE
type Consumable = Item & {
  type: typeof ITEM_TYPES[2]
}