// inventoryStore.ts
import { create } from "zustand";
import { ItemType } from "@/types/items";
import { ITEM_REGISTRY, ItemIds } from "@/types/constants";

// Type for save
type InvData = {
  inventory: Inventory,
  equipments: Inventory
}

// Slot type
type Slot = {
  item?: ItemType;
};
// Inventory type
type Inventory = Slot[];

// Inventory States
type InventoryStoreState = {
  inventory: Inventory;
  equipments: Inventory;
  draggedIndex: {
    inventory: number | null,
    equipments: number | null
  }
};

// Inventory Methods
type InventoryStoreAction = {
  setDraggedIndex: (index: number, where?: "inventory" | "equipments") => void;
  moveItem: (targetIndex: number, where?: "inventory" | "equipments") => void;
  getCurrent: (attr?: "inventory" | "equipments") => Inventory;
  addItem: (itemId: ItemIds, where?: "inventory" | "equipments") => void;
  removeItem: (index: number, where?: "inventory" | "equipments") => void;
  generateInventory: (size: number) => Inventory;
  reset: () => void;
  loadSave: (invData: InvData) => void;
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
  equipments: generateInventory(8),
  draggedIndex: {
    inventory: null,
    equipments: null
  },

  // Function to generate inventory slots
  generateInventory: (size: number) => {
    return Array.from({ length: size }, () => ({
      item: undefined,
    }));
  },

  setDraggedIndex: (index, where="inventory") => {
    const { draggedIndex } = get();
    const newDraggedIndex = structuredClone(draggedIndex);

    newDraggedIndex[where] = index

    set({ draggedIndex: newDraggedIndex })
  },

  moveItem: (targetIndex, where="inventory") => {
    const { draggedIndex } = get();

    const newInventory = structuredClone(get()[where]);
    const newDraggedIndex = structuredClone(draggedIndex);

    if (newDraggedIndex[where] === null) return;

    const index = newDraggedIndex[where] as number;

    // troca os itens
    [newInventory[index], newInventory[targetIndex]] = [newInventory[targetIndex], newInventory[index]];

    newDraggedIndex[where] = null;

    set({
      [where]: newInventory,
      draggedIndex: newDraggedIndex,
    });
  },

  // Gets the inventory state
  getCurrent: (attr="inventory") => get()[attr],

  // Adds an item to the inventory
  addItem: (itemId, where="inventory") => {
    const inventory = [...get()[where]];

    inventory.some((slot, index) => {
      if (!slot.item) {
        inventory[index].item = structuredClone(ITEM_REGISTRY[itemId]);
        return true; // stops the loop
      }
      return false;
    });

    set({ [where]: inventory });
  },

  // Removes an item from the inventory
  removeItem: (index, where="inventory") => {
    const inventory = [...get()[where]];
    inventory[index].item = undefined;

    set({ [where]: inventory });
  },

  // Resets all the items in the inventory store
  reset: () => set({ inventory: generateInventory(36), equipments: generateInventory(8) }),

  // Load data from save
  loadSave: (invData: InvData) => set({ inventory: invData.inventory, equipments: invData.equipments }),
}));
