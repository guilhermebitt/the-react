// Items constant
export const items = {

  // WEAPONS
  weapons: {
    iron_sword: {
      id: "iron_sword",
      name: "Iron Sword",
      description: "WIP",
      rarity: "common",
      imagePath: "/public/assets/items/weapons/iron_sword.png",

      stackable: false,

      type: "weapon",
      baseDamage: 10
    }
  },

  // CONSUMABLES
  consumables: {
    small_healing_potion: {
      id: "small_healing_potion",
      name: "Small Healing Potion",
      description: "WIP",
      rarity: "common",
      imagePath: "/public/assets/items/consumables/small_healing_potion.png",

      stackable: false,

      type: "consumable"
    }
  },
} as const;
