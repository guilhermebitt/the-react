// Contexts
import { useTick } from "../context/TickProvider";
import { useAudio } from "../context/AudioProvider";
import { usePlayer } from "../context/PlayerProvider";
import { useEnemies } from "../context/EnemiesProvider";



// This hook will group all the other context hooks
export function useGame() {
  const tick = useTick();
  const audio = useAudio();
  const player = usePlayer();
  const enemiesController = useEnemies();

  return { tick, audio, player, enemiesController };
}
