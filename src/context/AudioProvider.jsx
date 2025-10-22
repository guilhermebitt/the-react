// Data
import settingsJson from '../data/settings.json' with { type: 'json' };

// Dependencies
import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

const AudioContext = createContext(); // Creating an audio context

export function AudioProvider({ children }) {
  // Used to control all the audios in the game
  const [audios, setAudios] = useState({});

  // getting settings from localStorage
  const [settings] = useLocalStorage('settings', settingsJson);

  useEffect(() => {
    Object.values(audios).forEach(audio => {
      if (!audio?.type) return;

      // Applying the new sound settings
      switch(audio?.type) {
        case 'music':
          audio.volume = settings?.musicVolume * settings?.volume ?? 1;
          break;
        case 'sfx':
          audio.volume = settings?.sfxVolume * settings?.volume ?? 1;
          break;
      }
    })
  }, [settings.volume, settings.musicVolume, settings.sfxVolume]);

  const create = ({
    // Parameters
    name,
    src,
    loop = false,
    type = 'sfx',
    muted = settings.muted

  }) => {
    // Verifying if the audio received a name
    if (!name) {
      console.warn("⚠️ create() in AudioProvider called without name, the audio will not be created.");
      return;
    }
    // Verifying if the audio already exists (won't rewrite)
    if (audios[name]) return;

    // Creating the audio instance
    const audio = new Audio(src);
    audio.loop = loop;
    audio.muted = muted;
    audio.type = type;

    // ADDING CUSTOM METHODS TO AUDIO OBJECT
    // verifies if the audio is playing
    audio.isPlaying = () => {
      return (
        !audio.paused &&
        !audio.ended &&
        audio.readyState > 2 // HAVE_FUTURE_DATA
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
    switch(type) {
      case 'music':
        audio.volume = settings?.musicVolume * settings?.volume ?? 1;
        break;
      case 'sfx':
        audio.volume = settings?.sfxVolume * settings?.volume ?? 1;
        break;
    }

    // Adding the new audio to the audios state
    setAudios((prev) => ({
        ...prev,
        [name]: audio
      }));
  };

  const remove = (name) => {
    if (!audios[name]) return;

    setAudios(prev => {
      const newAudios = { ...prev };
      delete newAudios[name];
      return newAudios;
    })
  };

  const get = (name = 'GET_ALL_AUDIOS') => {
    if (name === 'GET_ALL_AUDIOS') return audios;
    try {
      return audios[name];
    } catch (error) {
      console.error("Something went wrong:", error.message);
      return undefined;
    }
  };

  return (
    <AudioContext.Provider value={{ get, create, remove }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);
