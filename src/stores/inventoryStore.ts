// inventoryStore.ts
import { create } from "zustand";
import { ItemType } from "@/types/items";
import { ItemIds } from "@/types/constants";

// Slot type
type Slot = {
  item?: ItemType
}

// Inventory States
type InventoryStoreState = {
  inventory: {
    [key: number]: Slot
  }
};

// Inventory Methods
type InventoryStoreAction = {
  addItem: (itemId: ItemIds) => void;
  reset: () => void;
};

// Store type
type InventoryStore = InventoryStoreState & InventoryStoreAction;

// Function to generate inventory slots
const generateInventory = (size: number) => {
  return Object.fromEntries(
    Array.from({ length: size }, (_, i) => [
      i + 1,
      {}
    ])
  );
};

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  inventory: generateInventory(36) as {[key: number]: Slot},

  // Adds an item to the inventory
  addItem: (itemId) => {
  },
  
  // useItem(inv[1].item)

  // Resets all the items in the inventory
  reset: () => set({ inventory: {}}),
}));
