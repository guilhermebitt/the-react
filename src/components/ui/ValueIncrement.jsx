// Dependencies
import { useEffect, useState } from "react";
import * as funcs from '../../utils/functions.js';

// Hooks
import { useGame } from "../../hooks/useGame";

/**
 * Counter Component
 * Animates a number from 0 to `finalValue` over a given `duration`.
 *
 * Props:
 *  - finalValue: number → the final number to reach
 *  - duration: number → animation time in ms (default: 1000)
 *  - onFinish: function → optional callback triggered when animation completes
 *  - sound: HTMLAudioElement → optional sound to play on each increment
 */
function ValueIncrement({ finalValue, duration = 1000, onFinish, type }) {
  // Holds the current number being displayed
  const [value, setValue] = useState(0);
  // Get the audios to play the sound
  const { audios, game } = useGame();

  useEffect(() => {
    let startTime = null; // stores the animation start time
    let lastValue = 0;
    let lastSoundTime = 0;

    // Creates an audio if not exists for the tick sound
    audios.create({ name: 'pointSound', src: '/assets/sounds/misc/point.ogg' });

    // Function that runs every frame (~60 times per second)
    const step = (timestamp) => {
      // Set the start time on the first frame
      if (!startTime) startTime = timestamp;

      // Calculate the animation progress (0 → 1)
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Calculate the current value based on progress
      const currentValue = Math.floor(progress * finalValue);

      // Update the state so React re-renders the new value
      setValue(currentValue);

      // Plays the audio
      if (
        currentValue !== lastValue &&
        audios.get("pointSound") &&
        timestamp - lastSoundTime >= 100 // minimal time to wait to play the sound again
      ) {
        audios.get("pointSound").start();
        lastSoundTime = timestamp; // atualiza o último timestamp do som
        lastValue = currentValue;  // atualiza último valor
      }

      // If animation is not done yet, keep requesting next frame
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Call the callback function when animation finishes
        if (onFinish) onFinish();
      }
    };

    // Start the animation
    requestAnimationFrame(step);
  }, [finalValue, duration]); // re-run animation if finalValue or duration changes

  // Render the number on screen
  if (type === "time") return <span>{funcs.tickToTime(value, game.get().tickSpeed)}</span>;
  return <span>{value}</span>;
}

export default ValueIncrement;