// Importing TS types
import { GameData, GameUpdater } from "@/types";

// Interface for the deps
export interface EventsLogicDeps {
  getGame: () => GameData;
  updateGame: GameUpdater;
}

// Functions that handle the context dependencies
export function createEventsLogic(deps: EventsLogicDeps) {
  const { getGame, updateGame } = deps;

  return {
    // Function to pass the events in the map
    passEvents() {
      const game = getGame();
      let nextSectionId = game?.currentMapSection + 1;
      let nextEvents: number[] = [];

      // Getting the next section
      const nextSection = game.mapArea[nextSectionId];

      // Setting up the next events
      nextSection?.events.map((event) => {
        if (!event?.isFinished) {  // If the event is not "finished"/skipped
          if (typeof event.eventId === "number") {
            nextEvents.push(event?.eventId);
          }
        }
      });

      // Adding the nextEvents to the eventsEnabled
      updateGame({ eventsEnabled: nextEvents })

      // Updating the currentMapSection
      updateGame({ currentMapSection: nextSectionId });
    },

    // Finishes the event
    finishEvent() {
      const game = getGame();
      const event = game?.eventData?.event;
      const pathToEvent = this.findEventPath(event?.eventId);
      if (pathToEvent) {
        // Updating the event on mapArea
        updateGame({ [pathToEvent]: (prev: any) => ({...prev, "isFinished": true}) });
        // Updating the event on eventData
        updateGame({ "eventData.event.isFinished": true });
      }
      this.passEvents();
    },

    // Gets the event by the ID
    getEventById(id: number) {
      const game = getGame();
      // This function return the event by its ID
      for (const data of game?.mapArea) {
        const found = data?.events.find(event => event?.eventId === id);
        if (found) return found;
      }
      return null;
    },

    // Function that returns the last ID of the mapArea events
    getLastEventId() {
      const game = getGame();
      let lastEventId = -1;  // If the last was "-1", the actual is 0 :)
      for (const section of game.mapArea) {
        for (const event of section.events) {
          if (typeof event.eventId === "number") {
            lastEventId = event.eventId;
          }
        }
      }

      return lastEventId;
    },

    // Gets the event by the path
    findEventPath(id: number | undefined) {
      const game = getGame();
      // This function return the path to the event passed by the ID
      for (let i = 0; i < game?.mapArea.length; i++) {
        const section = game?.mapArea[i];
        for (let j = 0; j < section?.events?.length; j++) {
          const event = section?.events[j];
          if (event?.eventId === id) {
            return `mapArea.${i}.events.${j}`;
          }
        }
      }
      return null;
    }
  };
}
