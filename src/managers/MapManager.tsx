// Dependencies
import { useEffect, useState } from "react";
import { useStore } from "@/stores";

// Map manager component
export function MapManager() {
  const game = useStore("game", "actions")
  const [bossState, setBossState] = useState<any>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
  }, [loading])

  // PROBABLY TEMPORARY
  useEffect(() => {
      // Getting the boss event
    const map = game.getCurrent().mapArea

    // Searching for the last event
    const last_section = map[-1]
    const bossEvent = last_section.events[0]

    setBossState(bossEvent)
  }, [game.getCurrent()])



  // Executes only if the player beat the boss
  useEffect(() => {
    if (!loading) return

    console.log(bossState)
  }, [bossState, loading])

  return null;
}
