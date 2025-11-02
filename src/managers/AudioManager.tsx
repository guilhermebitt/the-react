// Dependencies
import { useEffect, useState } from "react";
import { useStore } from "@/stores";
import { useLocalStorage } from "usehooks-ts";
import settingsJson from "@/data/settings.json";

// Audio manager component
export function AudioManager() {
  const audios = useStore("audios", "actions");
  const audiosObj = useStore("audios", (s) => s.audios);
  const [settings] = useLocalStorage("settings", settingsJson);
  const [firstLoad, setFirstLoad] = useState(true); // This state will cause a second re-render after it change

  // Creating the audios on the first render of this manager
  useEffect(() => {
    // Creating audios
    audios.create({ name: "gameMusic", src: "/assets/sounds/musics/the_music.ogg", loop: true, type: 'music' });
    audios.create({ name: "mapMusic", src: "/assets/sounds/musics/the_music.ogg", loop: true, type: 'music' }); //Will be replaced later
    audios.create({ name: "deathMusic", src: "/assets/sounds/musics/you_died.ogg", type: 'music' });
    audios.create({ name: "hitSound", src: "/assets/sounds/misc/hit_sound.ogg" });
    audios.create({ name: 'pointSound', src: '/assets/sounds/misc/point.ogg' });
    audios.create({ name: 'levelUp', src: '/assets/sounds/misc/level_up.ogg' });

    setFirstLoad(false)
  }, []);

  // Mutating the audios
  useEffect(() => {
    // This will make the useEffect wait until the audios are created, so it will mute all
    if (firstLoad) return;

    Object.values(audiosObj).forEach((audio) => {
      audio.muted = settings.muted;
    });
  }, [settings.muted, firstLoad]);

  // Checks if the sound changed
  useEffect(() => {
    // This will make the useEffect wait until the audios are created, so it will mute all
    if (firstLoad) return;

    Object.values(audiosObj).forEach((audio) => {
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
  }, [audiosObj, settings.volume, settings.musicVolume, settings.sfxVolume, firstLoad]);

  return null;
}
