// Contexts
import { useTick } from "@/context/TickProvider";
import { useAudio } from "@/context/AudioProvider";
import { usePlayer } from "@/context/PlayerProvider";
import { useEnemies } from "@/context/EnemiesProvider";
import { useGameData } from "@/context/GameProvider";
import { useLogic } from "@/context/LogicProvider";



// This hook will group all the other context hooks
export function useGame() {
  const tick = useTick();
  const audios = useAudio();
  const player = usePlayer();
  const enemies = useEnemies();
  const game = useGameData();
  const logic = useLogic();

  return { tick, audios, player, enemies, game, logic };
}