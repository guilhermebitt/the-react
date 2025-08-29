// Contexts
import { useTick } from "../context/TickProvider";
import { useAudio } from "../context/AudioProvider";



// This hook will group all the other context hooks
export function useGame() {
  const tick = useTick();
  const audio = useAudio();

  return { tick, audio };
}
