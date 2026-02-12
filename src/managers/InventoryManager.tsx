// Dependencies
import { useStore } from "@/stores";

// Inventory manager component
export function InventoryManager() {
  const inventory = useStore("inventory", "actions");

  return null;
}
