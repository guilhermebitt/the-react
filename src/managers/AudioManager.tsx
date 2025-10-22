// Dependencies
import { useEffect } from "react";
import { useStore } from "@/stores";
import { useLocalStorage } from "usehooks-ts";
import settingsJson from "@/data/settings.json";

// Audio manager component
export function AudioManager() {
  const audios = useStore("audios", (s) => s.audios);
  const [settings] = useLocalStorage("settings", settingsJson);

  // Checks if the sound changed
  useEffect(() => {
    Object.values(audios).forEach((audio) => {
      // If the audio as no type, returns
      if (!audio?.type) return;

      // Matching the audio type 
      switch (audio.type) {
        case "music":
          audio.volume = (settings.musicVolume ?? 1) * (settings.volume ?? 1);
          break;
        case "sfx":
          audio.volume = (settings.sfxVolume ?? 1) * (settings.volume ?? 1);
          break;
      }
    });
  }, [audios, settings.volume, settings.musicVolume, settings.sfxVolume]);

  return null;
}
