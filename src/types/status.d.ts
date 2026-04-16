import { OnRoundEnd } from "./global";
import statusJson from "@/data/status.json"

// status keys
type StatusKey = keyof typeof statusJson;

type StatusType = "DeBuff" | "Buff";

interface GlobalStatusEffects {
  onRoundEnd?: {
    [key: keyof OnRoundEnd]: number;
  }
}

interface DeBuffStatusEffects extends GlobalStatusEffects {
}

interface BuffStatusEffects extends GlobalStatusEffects {
}


type StatusEffects<T extends StatusType> = T extends "DeBuff"
  ? DeBuffStatusEffects
  : T extends "Buff"
  ? BuffStatusEffects
  : never;

type StatusUnion =
  | Status<"DeBuff">
  | Status<"Buff">

interface Status<T extends StatusType = StatusType> {
  id: StatusKey;
  name: string;
  description: string;
  flavorText: string;
  category: string;
  iconURL?: string;

  stackCount: number;
  maxStackCount: number;

  fixed: string,
  decreaseStack: 1,

  type: T;
  effects: StatusEffects<T>;

  translates: {
    [key: string]: any;
  }
}
