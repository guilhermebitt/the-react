// Importing dependencies
import { create } from "zustand";

// Logic
import { createEventsLogic } from '@/logic/eventsLogic';
import { createMapLogic } from '@/logic/mapLogic';
import { useTurnLogic } from "@/logic/turnLogic";

// State type
type LogicStoreState = {
};
// Action type
type LogicStoreAction = {
};
// Store type
type LogicStore = LogicStoreState & LogicStoreAction;

// Logic store hook
export const useLogicStore = create<LogicStore>((set, get) => ({
}));