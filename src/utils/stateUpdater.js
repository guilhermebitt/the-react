import { produce } from 'immer';

/**
 * Deeply updates a nested property in an object using dot notation.
 *
 * @param {Object} obj - The object being updated.
 * @param {string} path - A string path (dot notation) to the property.
 * @param {any|function} valueOrFn - The new value, or a function receiving the previous value.
 */
export const deepUpdate = (obj, path, valueOrFn) => {
  const keys = path.split('.');
  let current = obj;

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
 * ```js
 * const update = createUpdater(setPlayer);
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
 * @param {function} setState - The state setter returned from useState.
 * @returns {function(Object): void} - An updater function that applies the patch.
 */
export const createUpdater = (setState) => (patch) => {
  setState((prev) =>
    produce(prev, (draft) => {
      for (const key in patch) {
        deepUpdate(draft, key, patch[key]);
      }
    })
  );
};
