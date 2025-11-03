// This manager will control all the logic of the game without causing a unnecessary re-render on any component

// Data
import settingsJson from "../data/settings.json";

// Dependencies
import { useEffect, useRef, useCallback, useState } from "react";
import { useStore } from "@/stores";
import { EnemyData, SpawnableEnemy, TurnTypes } from "@/types";
import { useLogic } from "@/hooks";
import enemiesJson from "@/data/enemies.json";
import { Enemy } from "@/utils/entities";
import { useLocalStorage } from "usehooks-ts";

// Logic manager
export function BattleEventLogic() {
  // Debugging
  console.log("battle event logics reloaded...")

  // VARIABLES
  // References (Won't re-render the component)
  const lastTurn = useRef<TurnTypes>(null);
  // Stores
  const game = useStore("game", "actions");
  const enemies = useStore("enemies", "actions");
  const player = useStore("player", "actions");
  const audios = useStore("audios", "actions");
  const currentTurn = useStore("game", s => s.game.currentTurn);
  const isFirstLoad = useStore("game", s => s.game.eventData.isFirstLoad);
  const event = useStore("game", s => s.game.eventData?.event);
  const showLevelUpModal = useStore("game", s => s.game.showLevelUpModal);
  // Individual enemies
  const enemy1 = useStore("enemies", s => s.enemies?.[0]);
  const enemy2 = useStore("enemies", s => s.enemies?.[1]);
  const enemy3 = useStore("enemies", s => s.enemies?.[2]);
  // Other hooks
  const logic = useLogic();
  const [endEvent, setEndEvent] = useState(false);
  const [settings] = useLocalStorage("settings", settingsJson);

  // Variable for enemy selection keybind
  var selected = 1;
  var selectedmax = 1;

  // USE EFFECTS
  // Checking if the event is "battle" (ONLY EXECUTES ONCE PER BATTLE EVENT)
  useEffect(() => {
    // Conditions to skip:
    if (!event) return;  // If there is no event
    if (!isFirstLoad) return;  // If it's not the first load
    if (!location.pathname.includes("/battle")) return;  // If the location does not includes battle

    // Setting the event first load to false, so it won't re-render this useEffect anymore
    game.update({ "eventData.isFirstLoad": false })

    // I'll keep this for debugging
    console.log("event loaded for the first time");

    // Spawning the enemies
    if ((enemies.getCurrent() as Enemy[]).length < 1) {
      spawnEventEnemies(event.enemiesToSpawn);
    }
    

    // Resetting the player's actions
    player.update({ actionsLeft: player.getCurrent().actions })
    game.update({target : 1})

    // Resetting the game music
    audios.getAudio("gameMusic")?.stop();
  }, [event]);

  // Code that ends the event
  useEffect(() => {
    if (isFirstLoad) return;
    if (showLevelUpModal) return;

    if (endEvent) logic.finishEvent();

    // Resetting the endEvent variable
    setEndEvent(false);
  }, [endEvent, showLevelUpModal])

  // Constantly checks if the turn changed
  useEffect(() => {
    if (isFirstLoad) return;

    // Keeping the lastTurn
    const lastTurnTemp: TurnTypes = lastTurn.current;

    // Updates the last turn to the actual one
    lastTurn.current = currentTurn;

    // auto skip turn
    if (player.getCurrent().actionsLeft == 0 && settings.auto === true) {
      logic.switchTurn("enemies");
    }


    // Verifying if the last turn was onAction.
    // If the last turn was onAction, that means that
    // the entity is just going back to its turn, but
    // it don't need to executes the logic to the start
    // of the turn.

    if (lastTurnTemp === "onAction") {
      return;
    }

    

    // Verify what kind of turn it is
    switch (currentTurn) {
      case "player":
        logic.handlePlayerTurn();
        break;

      case "enemies":
        logic.handleEnemiesTurn();
        break;

      case null:
        // This says that there's not a entity turn
        game.update({ specificEntityTurn: -1 });
        break;

      default:
        return;
    }
  }, [currentTurn]);

  // Checking if all enemies are dead
  useEffect(() => {
    if (isFirstLoad) return;
    
    // If the event already finished, skips
    if (event?.isFinished) return;
    // This will check if: A) the enemy exists and B) the enemy is dead
    if (enemy1?.isDead() && (enemy2?.isDead() ?? true) && (enemy3?.isDead() ?? true)) {
      // Triggering the event finisher if all enemies are dead
      setEndEvent(true)
    }
  }, [enemy1, enemy2, enemy3])

  useEffect(() => {
    const handleKeyDown = (e) => 
    {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
      if (e.key === "ArrowRight") selected ++;
      if (e.key === "ArrowLeft") selected --;

      // Something weird is happening here, sometimes it works, 
      //others it thinks enemies from previous battles exist, maybe something to with how enemies are 'erased?'
      selectedmax = [enemy1,enemy2,enemy3].filter(x => x != undefined).length;

      if (selected < 1) selected = 1;
      if (selected > selectedmax) selected = selectedmax;

      game.update({target : selected})
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // FUNCTIONS
  // Creates a object (EnemyData) of the enemy to spawn
  const createEntityObj = useCallback((name: SpawnableEnemy, level = 1): EnemyData => {
    // Getting the base stats values
    const BASE_HEALTH = enemiesJson[name]["stats"]["health"];
    const BASE_ATTACK = enemiesJson[name]["stats"]["attack"];
    const BASE_DEFENSE = enemiesJson[name]["stats"]["defense"];
    const GROWTH_RATE = 1.5;

    const entity = new Object({
      ...enemiesJson["commonProperties"],
      ...enemiesJson[name],
      level: level,
      animations: {
        ...enemiesJson[name]["animations"],
        ...enemiesJson["deathAnimation"],
      },
      stats: {
        ...enemiesJson[name]["stats"],
        // Stat = default * const(1.5) * level - 1
        // Exemple:
        // snake lv 1 => health = 8
        // snake lv 2 => health = 12
        maxHealth: Math.floor(BASE_HEALTH * (1 + (level - 1) * (GROWTH_RATE - 1))),
        health: Math.floor(BASE_HEALTH * (1 + (level - 1) * (GROWTH_RATE - 1))),
        attack: Math.floor(BASE_ATTACK * (1 + (level - 1) * (GROWTH_RATE - 1))),
        defense: Math.floor(BASE_DEFENSE * (1 + (level - 1) * (GROWTH_RATE - 1))),
      },
    }) as EnemyData;

    return entity;
  }, [])

  // Creates an instance of a class with the EnemyData object by the name of it (and a level)
  const spawnEventEnemies = useCallback((enemiesToSpawn?: {name: SpawnableEnemy, level?: number}[] | null) => {
    let enemiesObjs: EnemyData[] = [];
    enemiesToSpawn?.forEach((enemy) => {
      enemiesObjs.push(createEntityObj(enemy?.name, enemy?.level));
    });
    enemies.spawnEnemies(enemiesObjs);
  }, [])

  return null;
}
