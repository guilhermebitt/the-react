// Dependencies
import { useEffect, useState } from "react";
import { useStore } from "@/stores";

// Hooks
import { useLogic } from "@/hooks";

// Types
import { Event } from "@/types";

// Map manager component
export function MapManager() {
  const game = useStore("game", "actions")
  const map = useStore("game", s => s.game.mapArea)
  const [lastEvent, setLastEvent] = useState<null|Event>()
  const [loading, setLoading] = useState(false)
  const logic = useLogic()

  // Loading useEffect
  useEffect(() => setLoading(true), [loading])

  // Getting the current lastEvent of the mapArea
  useEffect(() => {
    if (!loading) return

    const last = map?.[map?.length-1]?.events[0]
    last && setLastEvent(last)
  }, [map])

  // Effect when the lastEvent is finished
  useEffect(() => {
    if (lastEvent?.isFinished) {
      // Creating the new region and updating the game
      const newRegion = logic.createRegion()?.mapData
      game.update({ "mapArea": (prev: any) => [...prev, ...newRegion as any] })

      // Passing the events manually
      logic.passEvents()
    }
  }, [lastEvent])

  return null;
}
