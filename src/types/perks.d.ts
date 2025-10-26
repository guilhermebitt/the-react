import { Rarity, Increases } from "./global";
import perkJson from "@/data/perks.json"

// perks keys
type PerksKey = keyof typeof perkJson;

type PerkType = "battle" | "stats" | "economy";

interface BattlePerkEffects {
  increases?: {
    [key: keyof Increases]: number;
  }
}

interface StatsPerkEffects {
  increases?: {
    [key: keyof Increases]: number;
  }
}

interface EconomyPerkEffects {
  increases?: {
    [key: keyof Increases]: number;
  }
}

type PerkEffects<T extends PerkType> = T extends "battle"
  ? BattlePerkEffects
  : T extends "stats"
  ? StatsPerkEffects
  : T extends "economy"
  ? EconomyPerkEffects
  : never;

type PerkUnion =
  | Perk<"stats">
  | Perk<"battle">
  | Perk<"economy">;

interface Perk<T extends PerkType = PerkType> {
  id: PerksKey;
  name: string;
  description: string;
  rarity: Rarity;
  iconURL?: string;

  stackCount: number;
  maxStackCount: number;

  category: T;
  effects: PerkEffects<T>;
}
