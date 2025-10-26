// COLLAPSE ALL: CONTROL + K + CONTROL + 0
// COLLAPSE CLASSES: CONTROL + K + CONTROL + 1
// COLLAPSE METHODS: CONTROL + K + CONTROL + 2
// UNCOLLAPSE ALL: CONTROL+ K + CONTROL + J

/*
feat: uma nova funcionalidade
👉 Ex: feat(game): adiciona sistema de inventário

fix: correção de bug
👉 Ex: fix(ui): corrige alinhamento do botão

docs: mudanças apenas na documentação
👉 Ex: docs(readme): adiciona instruções de instalação

style: mudanças de formatação, sem alterar lógica
👉 Ex: style(css): aplica padrão de indentação

refactor: mudanças internas no código que não alteram comportamento
👉 Ex: refactor(api): simplifica função de busca

perf: melhoria de performance
👉 Ex: perf(render): otimiza renderização dos sprites

test: adição ou modificação de testes
👉 Ex: test(user): adiciona testes para cadastro

chore: tarefas de manutenção, dependências, configs, etc.
👉 Ex: chore(deps): atualiza eslint para v9
*/

// Data
import enemiesJson from "@/data/enemies.json";
import perksJson from "@/data/perks.json";
import gameJson from "@/data/game.json";

// Dependencies
import { useEffect, useState, useCallback } from "react";
import * as funcs from "../utils/functions";
import { getEntitiesAssets } from "../utils/loadAssets";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

// Components
import MapContainer from "../components/game/MapContainer";
import SectionButtons from "../components/common/SectionButtons";
import Header from "../components/game/Header";
import PlayerHUD from "../components/ui/PlayerHUD";
import Loading from "../components/common/Loading";
import ActionSection from "../components/sections/ActionSection";
import InventorySection from "../components/sections/InventorySection";
import PerksSection from "../components/sections/PerksSection";
import VictoryModal from "../components/ui/VictoryModal";
import LevelUpModal from "@/components/Perks/LevelUpModal";

// Hooks
import { useLogic } from "@/hooks";
import { useLoading } from "@/hooks";
import { useStore } from "@/stores";

// Stylesheet
import styles from "./BattleEvent.module.css";

// hudAssets
const hudAssets = [
  "assets/hud/coin.png",
  "assets/hud/heart.png",
  "assets/hud/shield.png",
  "assets/hud/sword.png",
  "assets/hud/stamina.png",
  "assets/images/star-solid-full.svg",
];

function BattleEvent() {
  // React Hooks
  const logic = useLogic();
  const { loading, loadAssets } = useLoading();
  const navigate = useNavigate();
  const location = useLocation();
  const [enemiesAlive, setEnemiesAlive] = useState(null);
  const [finishedEvent, setFinishedEvent] = useState(false);

  // Stores
  const tick = useStore("tick", "actions");
  const audioActions = useStore("audios", "actions");
  const playerActions = useStore("player", "actions");
  const enemiesActions = useStore("enemies", "actions");
  const game = useStore("game", "actions");

  // event
  const event = useStore("game", s => s.game.eventData.event)

  useEffect(() => {
    // Adding event listener to death music
    const handleAudioEnded = () => {
      // Code if the player died
      navigate("/deathscreen");
    };
    audioActions.getAudio("deathMusic")?.addEventListener("ended", handleAudioEnded);

    return () => {
      audioActions.getAudio("deathMusic")?.removeEventListener("ended", handleAudioEnded);
    };
  }, [audioActions?.getAudio("deathMusic")]);

  // LOADING
  useEffect(() => {
    // Getting the entities assets
    const entitiesToLoad = game.getCurrent()?.eventData?.event?.enemiesToSpawn.map((enemy) => {
      return createEntityObj(enemy?.name, enemy?.level);
    });
    entitiesToLoad?.push(playerActions.getCurrent());
    const entitiesAssets = getEntitiesAssets(entitiesToLoad) ?? [];

    // Pushing all assets to an array
    const assets = [...entitiesAssets, ...hudAssets];

    // Loading assets
    loadAssets(assets);

    return () => {
      tick.stop(); // tick stops when the game exit the battle component
      audioActions.getAudio("gameMusic")?.pause(); // Stops the music after exiting the component
    }
  }, []);

  // On game reload:
  useEffect(() => {
    if (loading) return;
    if (location.pathname === "/battle") navigate("/battle/action", { replace: true });

    // Starting the gameTick
    tick.start();

    // If is the first time entering the event (going to settings and get back will not have any effect)
    if (game.getCurrent().eventData.type === null) {
      game.update({ "eventData.type": "battle" });
      game.update({ "eventData.timeEntered": tick.getCurrent() }); // I have to keep an eye here
    }

    // Changing the animations tickSpeed to fit with the game tick
    playerActions.update({ "animations.standBy.duration": game.getCurrent().tickSpeed });

    enemiesActions.getCurrent().forEach((enemy) => {
      enemy.update?.({ "animations.standBy.duration": game.getCurrent().tickSpeed });
    });
  }, [loading]);

  // Starting the gameMusic
  useEffect(() => {
    if (loading) return;

    if (playerActions.getCurrent().isDead()) return; // Guaranteeing that the music won't start if the player is dead
    // The music only starts if its not playing and it exists
    if (!audioActions.getAudio("gameMusic")?.isPlaying()) audioActions.getAudio("gameMusic").play();
  }, [audioActions.getAudio("gameMusic"), loading]);

  // --- MAIN FUNCTIONS ---
  const createEntityObj = useCallback((name, level = 1) => {
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
    });

    return entity;
  }, [])

  // Section functions
  const sec1 = useCallback(() => {
    navigate("action", { replace: true });
  }, []);
  const sec2 = useCallback(() => {
    navigate("inventory", { replace: true });
  }, []);
  const sec3 = useCallback(() => {
    navigate("perks", { replace: true });
  }, []);
  const sec4 = useCallback(() => {
    navigate("#", { replace: true });
  }, []);

  // -- RETURNING THE GAME ---
  if (loading) return <Loading />;
  return (
    <main id={styles["game"]}>
      {/* VictoryModal */}
      {event?.isFinished && <VictoryModal />}
      <LevelUpModal />

      {/* TOP SECTION */}
      <section className={`${styles["x-section"]} ${styles["top"]}`}>
        <Header />
      </section>

      {/* MAP SECTION */}
      <section className={`${styles["x-section"]} ${styles["map"]}`}>
        <PlayerHUD />
        <MapContainer map={funcs.getCurrentMap()} />
      </section>

      {/* STATS AND TERMINAL */}
      <section className={`${styles["x-section"]} ${styles["statistics"]}`}>
        <Routes>
          <Route path="action" element={<ActionSection />} />
          <Route path="inventory" element={<InventorySection />} />
          <Route path="perks" element={<PerksSection />} />
        </Routes>
      </section>

      {/* ACTION BUTTONS */}
      <section className={`${styles["x-section"]} ${styles["bottom"]}`}>
        <SectionButtons sec1={sec1} sec2={sec2} sec3={sec3} sec4={sec4} />
      </section>
    </main>
  );
}

export default BattleEvent;
