// Importing dependencies
import { create, StoreApi, UseBoundStore } from "zustand";
import settings from "@/data/settings.json"

// Audio types
type AudioType = "sfx" | "music";
// Audio special object interface
interface CustomAudio extends HTMLAudioElement {
  type: AudioType,
  isPlaying: () => boolean,
  start: () => void,
  stop: () => void,
}
// Audios object type
type AudiosObj = {
  [key: string]: CustomAudio;
};
// State type
type AudioStoreState = {
  audios: AudiosObj;
};
// Action type
type AudioStoreAction = {
  create: (params: CreateAudioParams) => void;
  remove: (name: string) => void;
  getAudio: (name: string) => CustomAudio | undefined;
  getAudios: () => AudiosObj;
};
// Parameters type
type CreateAudioParams = {
  name: string;
  src: string;
  loop?: boolean;
  type?: AudioType;
  muted?: boolean;
};
// Store type
type AudioStore = AudioStoreState & AudioStoreAction;

// Audio store hook
export const useAudiosStore = create<AudioStore>((set, get) => ({
  audios: {},

  create: ({
    // Parameters
    name,
    src,
    loop = false,
    type = "sfx",
    muted = false
  }) => {
    // Verifying if the audio received a name
    if (!name) return console.warn("⚠️ create() in AudioProvider called without name, the audio will not be created.");

    if (get().audios[name]) return console.warn("⚠️ audio", name, "already exists at audios store.");

    // Creating the audio instance
    const audio = new Audio(src) as CustomAudio;
    audio.loop = loop;
    audio.muted = muted;
    audio.type = type;

    // ADDING CUSTOM METHODS TO AUDIO OBJECT
    // verifies if the audio is playing
    audio.isPlaying = () => {
      return (
        !audio.paused && !audio.ended && audio.readyState > 2 // HAVE_FUTURE_DATA
      );
    };
    // starts the audio
    audio.start = () => {
      audio.pause();
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };
    // stops the audio
    audio.stop = () => {
      audio.pause();
      audio.currentTime = 0;
    };

    // Applying initial sound settings
    switch (type) {
      case "music":
        audio.volume = settings.musicVolume * settings.volume;
        break;
      case "sfx":
        audio.volume = settings.sfxVolume * settings.volume;
        break;
    }

    // Adding the new audio to the audios state
    set((state) => ({
      audios: {
        ...state.audios,
        [name]: audio,
      },
    }));
  },

  remove: (name) => {
    if (!get().audios[name]) return console.warn("⚠️ There is no audio called", name);

    // Changing the audios object
    set((state) => ({
      audios: (() => {
        const newAudios = { ...state.audios };
        delete newAudios[name];
        return newAudios;
      })(),
    }));
  },

  getAudio: (name) => {
    try {
      return get().audios[name];
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Something went wrong:", error.message);
      } else {
        console.error("Something went wrong:", error);
      }
      return undefined;
    }
  },

  getAudios: () => get().audios,
}));