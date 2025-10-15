// Importing types
import { EntityData, GameData } from "@/types";

// Creates all possible paths for a T object
type DotPaths<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? K | `${K}.${DotPaths<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

// Patch Value e Path Value
type PatchValue<T> = T | ((prev: T) => T);

type PathValue<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : any
  : any;

// Updater Patch
type UpdaterPatch<T> = {
  [K in DotPaths<T>]?: PatchValue<PathValue<T, K>>;
};