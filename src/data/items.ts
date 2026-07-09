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
    },
    gold_sword: {
      id: "gold_sword",
      name: "Gold Sword",
      description: "An expensive sword, forged with gold.",
      subDescription: "Damage: 12",
      rarity: "uncommon",
      imagePath: "/assets/items/weapons/gold_sword.png",

      stackable: false,

      type: "weapon",
      damage: 12,
      multiplier: 1
    },
    silver_sword: {
      id: "silver_sword",
      name: "Silver Sword",
      description: "A gleaming silver sword, perfect for killing werewolves.",
      subDescription: "Damage: 15",
      rarity: "rare",
      imagePath: "/assets/items/weapons/silver_sword.png",

      stackable: false,

      type: "weapon",
      damage: 15,
      multiplier: 1
    },
    cleaver: {
      id: "cleaver",
      name: "Cleaver",
      description: "A cleaver, good for butchering, not so much for fighting.",
      subDescription: "Damage: 6",
      rarity: "common",
      imagePath: "/assets/items/weapons/cleaver.png",

      stackable: false,

      type: "weapon",
      damage: 6,
      multiplier: 1
    },
    double_cleaver: {
      id: "double_cleaver",
      name: "Double Cleavers",
      description: "Two cleavers, small enough to dual wield.",
      subDescription: "Damage: 12",
      rarity: "uncommon",
      imagePath: "/assets/items/weapons/double_cleaver.png",

      stackable: false,

      type: "weapon",
      damage: 12,
      multiplier: 1
    },
    cursed_cleaver: {
      id: "cursed_cleaver",
      name: "Cursed Cleaver",
      description: "A cursed weapon previously wielded by a butcher, better to not let this thing out of your sight.",
      subDescription: "Damage: 10 Multiplier: 1.5",
      rarity: "rare",
      imagePath: "/assets/items/weapons/cursed_cleaver.png",

      stackable: false,

      type: "weapon",
      damage: 10,
      multiplier: 1.5
    },
    mana_dagger: {
      id: "mana_dagger",
      name: "Mana Dagger",
      description: "A hilt that manifests a sharp dagger when held by someone with magic.",
      subDescription: "Damage: 16",
      rarity: "rare",
      imagePath: "/assets/items/weapons/mana_dagger.png",

      stackable: false,

      type: "weapon",
      damage: 16,
      multiplier: 1
    },
    moonBlade: {
      id: "moonBlade",
      name: "Moon Blade",
      description: "A sharp blade that shines like the light of the moon, it was said to be created at midnight on a full moon.",
      subDescription: "Damage: 24",
      rarity: "epic",
      imagePath: "/assets/items/weapons/moonblade.png",

      stackable: false,

      type: "weapon",
      damage: 24,
      multiplier: 1
    }
  },

  // SHIELDS
  shields: {
    makeshift_shield: {
      id: "makeshift_shield",
      name: "Makeshift Shield",
      description: "A hastely made shield, of tree bark",
      subDescription: "Defense: 3",
      rarity: "common",
      imagePath: "/assets/items/weapons/makeshift_shield.png",

      stackable: false,

      type: "shield",
      defense: 3
    },  
    guard_shield: {
      id: "guard_shield",
      name: "Guard Shield",
      description: "A good shield used by town guards",
      subDescription: "Defense: 5",
      rarity: "common",
      imagePath: "/assets/items/weapons/guard_shield.png",

      stackable: false,

      type: "shield",
      defense: 5
    },  
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
    leather_cap: {
      id: "leather_cap",
      name: "Leather Cap",
      description: 'A cheap cap made of leather, doesn`t offer much protection',
      subDescription: "Defense: 3",
      rarity: "common",
      imagePath: "/assets/items/armors/leather_cap.png",

      stackable: false,

      type: "armor",
      subtype: "helmet",
      defense: 3
    },
    crusade_helmet: {
      id: "crusade_helmet",
      name: "Crusade Helmet",
      description: 'A simple but sturdy knight helmet',
      subDescription: "Defense: 5",
      rarity: "common",
      imagePath: "/assets/items/armors/crusade_helmet.png",

      stackable: false,

      type: "armor",
      subtype: "helmet",
      defense: 5
    },
    demonic_helmet: {
      id: "demonic_helmet",
      name: "Demonic Helmet",
      description: 'A helmet made of 100% demon materials! ... well technically 60%',
      subDescription: "Defense: 10",
      rarity: "uncommon",
      imagePath: "/assets/items/armors/demonic_helmet.png",

      stackable: false,

      type: "armor",
      subtype: "helmet",
      defense: 10
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

      stackable: true,

      type: "consumable"
    },
    small_mana_potion: {
      id: "small_mana_potion",
      name: "Small Mana Potion",
      description: "A potion created with simple forest materials that heals your soul",
      rarity: "common",
      imagePath: "/assets/items/consumables/small_mana_potion.png",

      stackable: true,

      type: "consumable"
    }
  },
} as const;
