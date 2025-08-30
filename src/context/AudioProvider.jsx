// Data
import settingsJson from '../data/settings.json' with { type: 'json' };

// Dependencies
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLocalStorage } from 'usehooks-ts';



const AudioContext = createContext();  // Creating an audio context

export function AudioProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [settings] = useLocalStorage('settings', settingsJson);

  useEffect(() => {
    const audio = audioRef.current;
    audio.muted = settings.muted;
  }, [settings.muted]);

  const playMusic = (src, loop = true) => {
    const audio = audioRef.current;
    audio.pause();
    audio.src = src;
    audio.loop = loop;
    audio.volume = settings.musicVolume;
    audio.muted = settings.muted;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const stopMusic = () => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
  };

  const isPlaying = () => {
    const audio = audioRef.current;
    return (
      audio.currentTime > 0 && 
      !audio.paused && 
      !audio.ended && 
      audio.readyState > 2
    );
  };

  const get = () => {
    const audio = audioRef.current;
    return audio
  }


  return (
    <AudioContext.Provider value={{ get, playMusic, stopMusic, isPlaying }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);