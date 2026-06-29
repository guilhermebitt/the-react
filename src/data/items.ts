// Items constant
export const items = {

  // WEAPONS
  weapons: {
    iron_sword: {
      id: "iron_sword",
      name: "Iron Sword",
      description: "A sword, forged with iron.",
      subDescription: "Damage: 10",
      rarity: "common",
      imagePath: "/assets/items/weapons/iron_sword.png",

      stackable: false,

      type: "weapon",
      damage: 10,
      multiplier: 1
    }
  },

  // ARMORS
  armors: {
    // HELMETS
    unknown_helmet: {
      id: "unknown_helmet",
      name: "Unknown Helmet",
      description: 'There is a tag in the helmet, "Graggle". Who is he??',
      subDescription: "Defense: 20",
      rarity: "legendary",
      imagePath: "/assets/items/armors/unknown_helmet.png",

      stackable: false,

      type: "armor",
      subtype: "helmet",
      defense: 20
    },
  },

  // CONSUMABLES
  consumables: {
    small_healing_potion: {
      id: "small_healing_potion",
      name: "Small Healing Potion",
      description: "A potion created with simple forest materials that heals your wounds",
      rarity: "common",
      imagePath: "/assets/items/consumables/small_healing_potion.png",

      stackable: false,

      type: "consumable"
    }
  },
} as const;
