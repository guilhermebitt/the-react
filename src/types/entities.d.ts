// Base types of entities atributes

// Imports
import { UpdaterPatch } from "@/types";

// Entities id
enum EntityIds {
  None = -1,
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

interface Increases {
  [key: keyof Stats]: number;
}

interface OnKill {
  [key: keyof Stats]: number;
}

// Common atributes for all entities
export interface BaseEntityData {
  // Atributes that differs the entities
  id: EntityIds;
  name: string;
  className: string;
  entityType: "player" | "enemy" | "NPC";
  img: string;
  stats: Stats;

  // Atributes for the animations
  currentAnim: AnimationKeys;
  states: State[];
  animations: Record<AnimationKeys, Animation>;

  // Turns atributes
  skipTurn: boolean;
  actions: number;
  actionsLeft: number;

  // Gameplay
  kills: number;
  level: number;

  increases: Increases;
  onKill: OnKill;

  // Others
  spanMessages?: SpanMessage[];
  update: (patch: UpdaterPatch<EntityData>) => void;
}

interface PlayerData extends BaseEntityData {
  xp: number;
}

interface EnemyData extends BaseEntityData {
  isBoss: boolean;
  isDiscovered: boolean;
  loot: Loot;
}

type EntityData = PlayerData | EnemyData;