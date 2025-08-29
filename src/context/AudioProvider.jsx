// Data
import settings from '../data/settings.json' with { type: json };

// Dependencies
import { createContext, useContext, useRef, useState } from "react";



const AudioContext = createContext();  // Creating an audio context

export function AudioProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [muted, setMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(settings.musicVolume);

  const playMusic = (src, loop = true) => {
    const audio = audioRef.current;
    audio.pause();
    audio.src = src;
    audio.loop = loop;
    audio.volume = musicVolume;
    audio.muted = muted;
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
  }

  return (
    <AudioContext.Provider value={{ playMusic, stopMusic, isPlaying, muted, setMuted, musicVolume, setMusicVolume }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);