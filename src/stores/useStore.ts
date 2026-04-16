import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  useTickStore,
  useAudiosStore,
  usePlayerStore,
  useEnemiesStore,
  useGameStore,
  useBestiaryStore,
  useInventoryStore,
} from "@/stores";

/**
 * Extracts only the properties that are functions from a given type T.
 * @template T The source type (e.g., a class instance or interface).
 * @returns A new type with only the methods (functions) of T.
 */
type MethodsOf<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};

/**
 * Retrieves all unique function objects (methods) from an object and its entire prototype chain.
 * This is useful for extracting class methods that might not be enumerable.
 * 
 * @template T The type of the object being inspected.
 * @param {T} obj The object instance to inspect.
 * @returns {Function[]} An array containing all unique function objects.
 */
function getAllMethods<T extends object>(obj: T): Function[] {
  let currentObject: T | object | null = obj;
  const allMethods = new Map<string | symbol, Function>();

  // Walk up the prototype chain until we hit Object.prototype
  while (currentObject !== null && currentObject !== Object.prototype) {
    const propertyNames = Object.getOwnPropertyNames(currentObject);

    for (const name of propertyNames) {
      const propValue = (currentObject as any)[name];

      // Only add functions that haven't been added yet (handles method overriding)
      if (typeof propValue === "function" && !allMethods.has(name)) {
        allMethods.set(name, propValue);
      }
    }

    // Move to the next object in the prototype chain
    currentObject = Object.getPrototypeOf(currentObject);
  }

  return Array.from(allMethods.values());
}

// Map of all available Zustand stores
const stores = {
  game: useGameStore,
  tick: useTickStore,
  audios: useAudiosStore,
  player: usePlayerStore,
  enemies: useEnemiesStore,
  bestiary: useBestiaryStore,
  inventory: useInventoryStore,
} as const;

// Maps each store to its corresponding state type
type StoreStateMap = {
  game: ReturnType<typeof useGameStore.getState>;
  tick: ReturnType<typeof useTickStore.getState>;
  audios: ReturnType<typeof useAudiosStore.getState>;
  player: ReturnType<typeof usePlayerStore.getState>;
  enemies: ReturnType<typeof useEnemiesStore.getState>;
  bestiary: ReturnType<typeof useBestiaryStore.getState>;
  inventory: ReturnType<typeof useInventoryStore.getState>;
};

// Union type of all store names
type StoreName = keyof typeof stores;

// Extracts all function properties from a type
type StoreFunctions<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};

// Gets the complete state type of a specific store
type StateOfStore<TStore extends StoreName> = StoreStateMap[TStore];

/**
 * Extracts the type of the nested instance within a store's state.
 * For example, if you have usePlayerStore with state { player: Player, ... },
 * this extracts the Player type.
 * 
 * @template TStore The name of the store ('player', 'inventory', etc.).
 * @returns The type of the nested instance object.
 */
type InstanceTypeFromStore<TStore extends StoreName> = 
  TStore extends keyof StoreStateMap
    ? StoreStateMap[TStore] extends { [K in TStore]: infer Instance }
      ? Instance
      : never
    : never;

// Global cache for store actions (lives outside React component lifecycle)
const actionsCache = new Map<StoreName, any>();

// --- FUNCTION OVERLOADS FOR TYPE SAFETY ---

/**
 * Overload 1: Get all action functions from the store's state
 * @param storeName The name of the store
 * @param selector The literal string "actions"
 * @returns Object containing all store action functions
 */
export function useStore<TStore extends StoreName>(
  storeName: TStore,
  selector: "actions"
): StoreFunctions<StateOfStore<TStore>>;

/**
 * Overload 2: Get all methods from the store's nested instance object
 * @param storeName The name of the store
 * @param selector The literal string "instanceActions"
 * @returns Object containing all instance methods (e.g., player.attack())
 */
export function useStore<TStore extends StoreName>(
  storeName: TStore,
  selector: "instanceActions"
): MethodsOf<InstanceTypeFromStore<TStore>>;

/**
 * Overload 3: Use a custom selector function
 * @param storeName The name of the store
 * @param selector Custom selector function
 * @returns The selected value from the store
 */
export function useStore<TStore extends StoreName, TValue>(
  storeName: TStore,
  selector: (state: StateOfStore<TStore>) => TValue
): TValue;

// --- ACTUAL IMPLEMENTATION ---

/**
 * Universal Zustand store hook that provides three ways to access store data:
 * 
 * 1. Custom selector: useStore("player", s => s.player.health)
 * 2. All actions: useStore("player", "actions")
 * 3. Instance methods: useStore("player", "instanceActions")
 * 
 * @param storeName The name of the store to access
 * @param selector Either a selector function or a special string ("actions" | "instanceActions")
 * @returns The selected data, actions, or instance methods
 */
export function useStore<TStore extends StoreName, TValue>(
  storeName: TStore,
  selector: ((state: StateOfStore<TStore>) => TValue) | "actions" | "instanceActions"
): TValue | StoreFunctions<StateOfStore<TStore>> | MethodsOf<InstanceTypeFromStore<TStore>> {
  const storeHook = stores[storeName];

  // Case 1: Return all action functions from the store's state
  if (selector === "actions") {
    // Check if actions are already cached
    if (actionsCache.has(storeName)) {
      return actionsCache.get(storeName);
    }

    // Extract all functions from the store's state
    const state = storeHook.getState() as StateOfStore<TStore>;
    const actions = Object.fromEntries(
      Object.entries(state).filter(([_, v]) => typeof v === "function")
    ) as StoreFunctions<StateOfStore<TStore>>;

    // Cache for future use
    actionsCache.set(storeName, actions);
    return actions;
  }

  // Case 2: Return methods from the nested instance object
  if (selector === "instanceActions") {
    // Select the instance object from the store (e.g., state.player)
    const instance = (storeHook as any)(
      useShallow((state: StateOfStore<TStore>) => {
        // Get the object that has the same name as the store
        return (state as any)[storeName] ?? null;
      })
    );

    // Memoize the methods to avoid recreating them on every render
    const instanceActions = useMemo(() => {
      if (!instance || typeof instance !== "object") {
        return {} as MethodsOf<InstanceTypeFromStore<TStore>>;
      }

      // Extract all methods from the instance and its prototype chain
      const allFunctions = getAllMethods(instance);
      const actionMap: Record<string, Function> = {};

      allFunctions.forEach((func) => {
        const name = func.name;

        // Filter out constructor, private methods, and Object.prototype methods
        if (
          name &&
          name !== "constructor" &&
          !name.startsWith("_") &&
          name !== "hasOwnProperty" &&
          name !== "toString"
        ) {
          // Bind the method to the instance to preserve 'this' context
          actionMap[name] = func.bind(instance);
        }
      });

      return actionMap as MethodsOf<InstanceTypeFromStore<TStore>>;
    }, [instance]);

    return instanceActions;
  }

  // Case 3: Use the custom selector function with shallow comparison
  return (storeHook as any)(useShallow(selector)) as TValue;
}