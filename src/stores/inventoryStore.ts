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
  draggedIndex: number | null;
};

// Inventory Methods
type InventoryStoreAction = {
  setDraggedIndex: (index: number) => void;
  moveItem: (targetIndex: number) => void;
  getCurrent: () => Inventory;
  addItem: (itemId: ItemIds) => void;
  removeItem: (index: number) => void;
  generateInventory: (size: number) => Inventory;
  reset: () => void;
  loadSave: (invData: Inventory) => void;
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
  draggedIndex: null,

  // Function to generate inventory slots
  generateInventory: (size: number) => {
    return Array.from({ length: size }, () => ({
      item: undefined,
    }));
  },

  setDraggedIndex: (index) => set({ draggedIndex: index }),

  moveItem: (targetIndex) => {
    const { inventory, draggedIndex } = get();
    if (draggedIndex === null) return;

    const newInventory = [...inventory];

    // troca os itens
    [newInventory[draggedIndex], newInventory[targetIndex]] = [newInventory[targetIndex], newInventory[draggedIndex]];

    set({
      inventory: newInventory,
      draggedIndex: null,
    });
  },

  // Gets the inventory state
  getCurrent: () => get().inventory,

  // Adds an item to the inventory
  addItem: (itemId) => {
    const inventory = [...get().inventory];

    inventory.some((slot, index) => {
      if (!slot.item) {
        inventory[index].item = structuredClone(ITEM_REGISTRY[itemId]);
        return true; // stops the loop
      }
      return false;
    });

    set({ inventory: inventory });
  },

  // Removes an item from the inventory
  removeItem: (index) => {
    const inventory = [...get().inventory];
    inventory[index].item = undefined;

    set({ inventory: inventory });
  },

  // Resets all the items in the inventory
  reset: () => set({ inventory: generateInventory(36) }),

  // Load data from save
  loadSave: (invData: Inventory) => set({ inventory: invData }),
}));
