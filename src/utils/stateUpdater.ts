import { produce } from 'immer';
import { UpdaterPatch } from '@/types';

// Type for the generic state
type GenericSetState<T> = (fn: (prev: T) => T) => void;

/**
 * Deeply updates a nested property in an object using dot notation.
 *
 * @param obj - The object being updated.
 * @param path - A string path (dot notation) to the property.
 * @param valueOrFn - The new value, or a function receiving the previous value.
 */
export const deepUpdate = <T extends Record<string, any>>(
  obj: T,
  path: string,
  valueOrFn: any | ((prev: any) => any)
): void => {
  const keys = path.split('.');
  let current: any = obj;

  keys.slice(0, -1).forEach((k) => {
    if (current[k] === undefined) current[k] = {}; // cria se não existe
    current = current[k];
  });

  const lastKey = keys[keys.length - 1];
  const prevValue = current[lastKey];

  current[lastKey] =
    typeof valueOrFn === 'function' ? valueOrFn(prevValue) : valueOrFn;
};

/**
 * Creates a generic updater function for a given state setter, using Immer.
 *
 * Example usage in a context:
 * ```ts
 * interface Player {
 *   health: number;
 *   mana: number;
 *   stats: {
 *     attack: number;
 *   };
 * }
 *
 * const update = createUpdater<Player>(setPlayer);
 *
 * // Direct value
 * update({ health: 100 });
 *
 * // Increment value
 * update({ mana: prev => prev + 10 });
 *
 * // Nested property
 * update({ "stats.attack": 5 });
 * ```
 *
 * @param setState - The state setter returned from useState.
 * @returns An updater function that applies the patch.
 */
export const createUpdater = <T extends Record<string, any>>(
  setState: GenericSetState<T>
) => (patch: UpdaterPatch<T>): void => {
  setState((prev) =>
    produce(prev, (draft) => {
      for (const key in patch) {
        const typedKey = key as keyof typeof patch;
        deepUpdate(draft, typedKey as string, patch[typedKey]);
      }
    })
  );
};
