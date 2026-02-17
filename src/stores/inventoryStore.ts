// inventoryStore.ts
import { create } from "zustand";
import { Item, ItemType } from "@/types/items";
import { ITEM_REGISTRY, ItemIds } from "@/types/constants";

// Type for save
type InvData = {
  inventory: Inventory;
  equipments: Inventory;
};

// Slots types
const SLOT_TYPES = ["helmet", "chestplate", "legging", "boots", "weapon", "shield", "charm1", "charm2"] as const;

// Slot type
type Slot = {
  item?: ItemType;
  slotType?: (typeof SLOT_TYPES)[number];
};

// Inventory type
type Inventory = Slot[];

// Inventory States
type InventoryStoreState = {
  inventory: Inventory;
  equipments: Inventory;
  draggedIndex: {
    inventory: number | null;
    equipments: number | null;
  };
};

// Inventory Methods
type InventoryStoreAction = {
  setDraggedIndex: (index: number, where?: "inventory" | "equipments") => void;
  moveItem: (targetIndex: number, where?: "inventory" | "equipments") => void;
  getCurrent: (attr?: "inventory" | "equipments") => Inventory;
  addItem: (itemId: ItemIds, where?: "inventory" | "equipments") => boolean;
  addItemByObj: (item: ItemType, where?: "inventory" | "equipments") => boolean;
  removeItem: (index: number, where?: "inventory" | "equipments") => void;
  generateInventory: (size: number) => Inventory;
  generateEquipments: () => Inventory;
  reset: () => void;
  loadSave: (invData: InvData) => void;
  checkSlotType: (where: "inventory" | "equipments", index: number, item: ItemType) => boolean;
  equipItem: (item: ItemType, index: number) => void;
  unequipItem: (item: ItemType, index: number) => void;
};

// Store type
type InventoryStore = InventoryStoreState & InventoryStoreAction;

// Function to generate inventory slots
const generateInventory = (size: number) => {
  return Array.from({ length: size }, () => ({
    item: undefined,
  }));
};

// Function to generate equipments slots
const generateEquipments = () => {
  return Array.from({ length: 8 }).map((_, i) => ({
    item: undefined,
    slotType: SLOT_TYPES[i],
  }));
};

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  // Inventory slots
  inventory: generateInventory(36),
  equipments: generateEquipments(),
  draggedIndex: {
    inventory: null,
    equipments: null,
  },

  // Function to generate inventory slots
  generateInventory: (size: number) => {
    return Array.from({ length: size }, () => ({
      item: undefined,
    }));
  },

  // Function to generate equipments slots
  generateEquipments: () => {
    return Array.from({ length: 8 }, (i: number) => ({
      item: undefined,
      slotType: SLOT_TYPES[i],
    }));
  },

  setDraggedIndex: (index, where = "inventory") => {
    const { draggedIndex } = get();
    const newDraggedIndex = structuredClone(draggedIndex);

    newDraggedIndex[where] = index;

    set({ draggedIndex: newDraggedIndex });
  },

  moveItem: (targetIndex, where = "inventory") => {
    const { draggedIndex } = get();

    const newInventory = structuredClone(get()[where]);
    const newDraggedIndex = structuredClone(draggedIndex);

    // Getting the index of the item being moved
    const index = newDraggedIndex[where] as number;

    // Getting the item being moved
    const item = get()[where][index].item

    // Finishing the code if there is no item in the slot
    if (!item) return console.warn("⚠️ There is no item on moveItem() function in inventoryStore.ts.")

    // SlotType === ItemType?
    const result = get().checkSlotType(where, targetIndex, item);

    if (newDraggedIndex[where] === null || !result) return;

    //if ()

    // troca os itens
    [newInventory[index], newInventory[targetIndex]] = [newInventory[targetIndex], newInventory[index]];

    newDraggedIndex[where] = null;

    set({
      [where]: newInventory,
      draggedIndex: newDraggedIndex,
    });
  },

  // Gets the inventory state
  getCurrent: (attr = "inventory") => get()[attr],

  // Adds an item to the inventory
  addItem: (itemId, where = "inventory") => {
    const inventory = [...get()[where]];
    let response: boolean = false;

    inventory.some((slot, index) => {
      const item = structuredClone(ITEM_REGISTRY[itemId]);
      const result = get().checkSlotType(where, index, item);

      if (!slot.item && result) {
        inventory[index].item = item;
        response = true;
        return true; // stops the loop
      }
      return false;
    });

    set({ [where]: inventory });

    return response;
  },

  // Adding item by object
  addItemByObj: (item, where = "inventory") => {
    const inventory = [...get()[where]];
    let response: boolean = false;

    inventory.some((slot, index) => {
      const result = get().checkSlotType(where, index, item);

      if (!slot.item && result) {
        inventory[index].item = item;
        response = true;
        return true; // stops the loop
      }
      return false;
    });

    set({ [where]: inventory });

    return response;
  },

  // Removes an item from the inventory
  removeItem: (index, where = "inventory") => {
    const inventory = [...get()[where]];

    inventory[index].item = undefined;

    set({ [where]: inventory });
  },

  // Resets all the items in the inventory store
  reset: () => set({ inventory: generateInventory(36), equipments: generateEquipments() }),

  // Load data from save
  loadSave: (invData: InvData) => set({ inventory: invData.inventory, equipments: invData.equipments }),

  // Function to check if the slot can hold the item
  checkSlotType: (where, index, item) => {
    // Getting the slot to verify if its possible to move the item
    const slot = get()[where][index];

    // Creating the result of the operation
    let result = slot?.slotType === item.type;

    // If the slot does not have an item type, it will accept the item
    if (!slot?.slotType) {
      result = true;
    }

    return result;
  },

  // Trying to equip the item
  equipItem: (item, index) => {
    const equipments = [...get()["equipments"]];

    // Finishing the code if there is no item in the slot
    if (!item) return console.warn("⚠️ There is no item on moveItem() function in inventoryStore.ts.");

    // Adding the item to the equipments
    const addingResult = get().addItemByObj(item, "equipments");
    if (!addingResult) return console.warn("⚠️ Its not possible to add the item in inventoryStore.ts.");

    // Removing the item from the previous slot
    get().removeItem(index, "inventory");
  },

  // Trying to unequip the item
  unequipItem: (item, index) => {
    const inventory = [...get()["inventory"]];

    // Finishing the code if there is no item in the slot
    if (!item) return console.warn("⚠️ There is no item on moveItem() function in inventoryStore.ts.");

    // Adding the item to the inventory
    const addingResult = get().addItemByObj(item, "inventory");
    if (!addingResult) return console.warn("⚠️ Its not possible to add the item in inventoryStore.ts.");

    // Removing the item from the previous slot
    get().removeItem(index, "equipments");
  },
}));
