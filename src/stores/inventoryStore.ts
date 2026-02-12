// inventoryStore.ts
import { create } from "zustand";
import { ItemType } from "@/types/items";
import { ITEM_REGISTRY, ItemIds } from "@/types/constants";

// Slot type
type Slot = {
  item?: ItemType;
};
// Inventory type
type Inventory = Slot[];

// Inventory States
type InventoryStoreState = {
  inventory: Inventory;
};

// Inventory Methods
type InventoryStoreAction = {
  getCurrent: () => Inventory;
  addItem: (itemId: ItemIds) => void;
  reset: () => void;
};

// Store type
type InventoryStore = InventoryStoreState & InventoryStoreAction;

// Function to generate inventory slots
const generateInventory = (size: number) => {
  return Array.from({ length: size }, () => ({
    item: undefined,
  }));
};

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  // Inventory slots
  inventory: generateInventory(36),

  // Gets the inventory state
  getCurrent: () => get().inventory,

  // Adds an item to the inventory
  addItem: (itemId) => {
    const inventory = [...get().inventory];

    inventory.some((slot, index) => {
      if (!slot.item) {
        inventory[index].item = structuredClone(ITEM_REGISTRY[itemId])
        return true; // stops the loop
      }
      return false;
    });

    set({ inventory: inventory });
  },

  // useItem(inv[1].item)

  // Resets all the items in the inventory
  reset: () => set({ inventory: [] }),
}));
