// Base types of entities atributes

// Entities id
enum EntityIds {
  Player,
  Enemy1,
  Enemy2,
  Enemy3,
}

// Types for the states of the entity
type State = "hit" | "leveling" | "idle";

// Animations
type AnimationKeys = "standBy" | "atk" | "death";
interface Animation {
  frames: string[];
  duration: number;
}

// Stats
interface Stats {
  maxHealth: number;
  health: number;

  maxMana?: number;
  mana?: number;

  attack: number;
  strength: number;
  defense: number;
  constitution: number;
  crit: number;
  critChance: number;
  accuracy: number;
  evasion: number;
  money?: number;
}

// Span Message (message that will appear above the entity container)
interface SpanMessage {
  value: string | number;
  type?: string;
}

// Updater for any type T
type Updater<T> = T | ((prev: T) => T);

// All the nested paths is valid
type NestedKeys<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends object
    ? `${Prefix}${K & string}` | NestedKeys<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`
}[keyof T];

// Common atributes for all entities
export interface EntityData {
  // Atributes that differs the entities
  id: EntityIds;
  name: string;
  entityType: "player" | "enemy" | "NPC";
  img: string;
  stats: Stats;

  // Atributes for the animations
  currentAnim: AnimationKeys;
  states: State[];
  animations: Record<AnimationKeys, Animation>;

  // Turns atributes
  actions: number;
  actionsLeft: number;

  // Gameplay
  kills: number;
  level: number;
  xp?: number;

  // Enemies atributes
  loot: any;  // ADD LOOT TYPE HERE LATER

  // Others
  spanMessages?: SpanMessage[];
  update: (
    updates: {
      [K in keyof EntityData | NestedKeys<EntityData>]?: Updater<any>
    }
  ) => void;
}
