import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTickStore, useAudiosStore, usePlayerStore } from "@/stores";

/**
 * Statically extracts all function properties from a given type T.
 * * @template T The source type (e.g., a class instance or interface).
 * @returns A new type with only the methods (functions) of T.
 */
type MethodsOf<T> = {
  // Iterate over all keys K in T
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
  // The part 'as T[K] extends Function ? K : never' is a key remapping:
  // - If T[K] is a function, keep the key K.
  // - Otherwise, map the key to 'never', effectively removing it from the resulting type.
};

/**
 * Retrieves all unique function objects (methods) from an object and its entire prototype chain.
 *
 * @template T The type of the object being inspected (inferred by TypeScript).
 * @param {T} obj The object instance to inspect.
 * @returns {Function[]} An array containing all unique function objects.
 */
function getAllMethods<T extends object>(obj: T): Function[] {
  let currentObject: T | object | null = obj;
  // Use a Map to store functions by name, ensuring uniqueness (O(1) lookup)
  const allMethods = new Map<keyof T, Function>();

  while (currentObject !== null) {
    // Object.getOwnPropertyNames is a JS method, it doesn't use the TS type T
    const propertyNames = Object.getOwnPropertyNames(currentObject) as Array<keyof T>;

    for (const name of propertyNames) {
      // Check if it's a function and not already added (to handle shadowed methods)
      const propValue = (currentObject as T)[name];

      if (typeof propValue === "function" && !allMethods.has(name)) {
        // The type assertion 'as T[keyof MethodsOf<T>]' provides type safety for the Map value
        allMethods.set(name, propValue as Function);
      }
    }

    // Move to the next object in the prototype chain (Object.getPrototypeOf is safe for this)
    currentObject = Object.getPrototypeOf(currentObject);
  }

  // Return the function objects (the values of the Map)
  return Array.from(allMethods.values());
}

/**
 * Extracts the type of the property within the StoreStateMap[TStore]
 * that has the same name as the store (TStore).
 * E.g., for storeName 'player', it extracts the type of the 'player' property in the state.
 * * @template TStore The name of the store ('player', 'tick', etc.).
 * @returns The type of the nested instance (e.g., the Player class instance).
 */
type InstanceTypeFromStore<TStore extends StoreName> = StoreStateMap[TStore][TStore & keyof StoreStateMap[TStore]];

// Map of all available Zustand stores
const stores = {
  tick: useTickStore,
  audios: useAudiosStore,
  player: usePlayerStore,
};

// Map each store to its corresponding state type
type StoreStateMap = {
  tick: ReturnType<typeof useTickStore.getState>;
  audios: ReturnType<typeof useAudiosStore.getState>;
  player: ReturnType<typeof usePlayerStore.getState>;
};

// Type representing each store name
type StoreName = keyof typeof stores;

// Extracts all functions of a store | instance of store
type StoreFunctions<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};
// Extracts the state type of a specific store
type StateOfStore<TStore extends StoreName> = StoreStateMap[TStore];

// --- SOBRECARGAS DE FUNÇÃO PARA MELHOR TIPAGEM ---
export function useStore<TStore extends StoreName>(
  storeName: TStore,
  selector: "actions"
): StoreFunctions<StateOfStore<TStore>>;

export function useStore<TStore extends StoreName>(
  storeName: TStore,
  selector: "instanceActions"
): MethodsOf<InstanceTypeFromStore<TStore>>;

export function useStore<TStore extends StoreName, TValue>(
  storeName: TStore,
  selector: (state: StateOfStore<TStore>) => TValue
): TValue;

/**
 * - Accepts selector functions OR special keyword "actions"
 * - Automatically memoizes actions to avoid unnecessary re-renders
 *
 * Example usage:
 * const playerHealth = useStore("tick", state => state.player.health);
 */
export function useStore<TStore extends StoreName, TValue>(
  storeName: TStore,
  selector: ((state: StateOfStore<TStore>) => TValue) | "actions" | "instanceActions"
): TValue | StoreFunctions<StateOfStore<TStore>> {
  // Gets the hook of te selected store
  const storeHook = stores[storeName];

  // Getting all methods of the store
  if (selector === "actions") {
    // Grab all actions from the store
    const actions = (storeHook as any)(
      useShallow((s: StateOfStore<TStore>) => {
        const stateObj = { ...s };
        // Filter out non-functions (i.e., state)
        return Object.fromEntries(Object.entries(stateObj).filter(([_, v]) => typeof v === "function")) as TValue;
      })
    );

    // Memoize to avoid new object every render
    return useMemo(() => actions, [actions]) as StoreFunctions<StateOfStore<TStore>>;
  }

  // Getting all methods of the object in the store with the same -storeName-. <- IMPORTANT
  if (selector === "instanceActions") {
    const instanceObject = (storeHook as any)(
      // useShallow to avoid unnecessary re-renders
      useShallow((s: StoreStateMap[TStore]) => {
        // Getting the object of the store that has it same name
        const instanceKey = storeName as keyof StoreStateMap[StoreName];

        // Returns the instance only if it exists in the store
        if (s && s[instanceKey] !== undefined) {
          // Selects and returns the object
          return s[instanceKey];
        }
        return null;
      })
    );

    const instanceActions = useMemo(() => {
      // If the instance is null, returns an empty object
      if (instanceObject === null || typeof instanceObject !== "object" || instanceObject === undefined) {
        return {};
      }

      const allFunctions = getAllMethods(instanceObject as object);
      const actionMap: Partial<StoreFunctions<typeof instanceObject>> = {};

      // Maps the array of functions back to a object { functionName: function }
      allFunctions.forEach((func) => {
        const name = func.name as keyof StoreFunctions<typeof instanceObject>;

        // Filter some functions, like 'constructor' and 'Symbol.iterator' and methods
        // that starts with '_' (private methods convention)
        if (name && name !== "constructor" && !(name as string).startsWith("_")) {
          // Guarantee: Verifies if the name of the functions isn't is one action of Zustand
          actionMap[name] = func.bind(instanceObject) as any;
        }
      });

      return actionMap;
    }, [instanceObject]); // Recalculates only if the object of the instance change.

    // The return is the object of functions, typed correctly.
    return instanceActions as StoreFunctions<StateOfStore<TStore>>;
  }

  // Memoize selector to avoid creating new references unnecessarily
  const memoizedSelector = useMemo(() => selector, [selector]);

  // Apply Zustand's shallow comparison for optimized re-renders
  return (storeHook as any)(useShallow(memoizedSelector as any)) as TValue; // O "as any" é só pra parar de encher o saco
}
