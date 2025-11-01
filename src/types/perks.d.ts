import { Rarity, Increases } from "./global";
import perkJson from "@/data/perks.json"

// perks keys
type PerksKey = keyof typeof perkJson;

type PerkType = "battle" | "utility" | "economy" | "magic";

interface GlobalPerkEffects {
  increases?: {
    [key: keyof Increases]: number;
  }
}

interface BattlePerkEffects extends GlobalPerkEffects {
}

interface UtilityPerkEffects extends GlobalPerkEffects {
}

interface EconomyPerkEffects extends GlobalPerkEffects {
}

interface MagicPerkEffects extends GlobalPerkEffects {
}

type PerkEffects<T extends PerkType> = T extends "battle"
  ? BattlePerkEffects
  : T extends "utility"
  ? UtilityPerkEffects
  : T extends "economy"
  ? EconomyPerkEffects
  : T extends "magic"
  ? MagicPerkEffects
  : never;

type PerkUnion =
  | Perk<"battle">
  | Perk<"utility">
  | Perk<"economy">
  | Perk<"magic">;

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

  translates: {
    [key: string]: any;
  }
}
