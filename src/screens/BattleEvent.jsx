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
import enemiesJson from '../data/enemies.json' with { type: 'json' };

// Dependencies
import { useEffect, useState } from 'react';
import * as funcs from '../utils/functions';
import { getEntitiesAssets } from '../utils/loadAssets';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Components
import MapContainer from '../components/game/MapContainer';
import SectionButtons from '../components/common/SectionButtons';
import Header from '../components/game/Header';
import PlayerHUD from '../components/ui/PlayerHUD';
import Loading from '../components/common/Loading';
import ActionSection from '../components/sections/ActionSection';
import InventorySection from '../components/sections/InventorySection';
import SkillsSection from '../components/sections/SkillsSection';
import VictoryModal from '../components/ui/VictoryModal';

// Hooks
import { useGame } from '@/hooks';
import { useLoading } from '@/hooks';

// Stylesheet
import styles from'./BattleEvent.module.css';

// hudAssets
const hudAssets = [
  "assets/hud/coin.png",
  "assets/hud/heart.png",
  "assets/hud/shield.png",
  "assets/hud/sword.png",
  "assets/hud/stamina.png",
  "assets/images/star-solid-full.svg"
];

function BattleEvent() {
  // React Hooks
  const { tick, audios, player, enemies, game, logic } = useGame();
  const { loading, loadAssets } = useLoading();
  const navigate = useNavigate();
  const location = useLocation();
  const [enemiesAlive, setEnemiesAlive] = useState(null);
  const [finishedEvent, setFinishedEvent] = useState(false);

  // Initializing funcs
  funcs.init(game);

  // LOADING
  useEffect(() => {
    // Getting the entities assets
    const entitiesToLoad = game.get()?.eventData?.event?.enemiesToSpawn
      .map(enemy => {
        return createEntityObj(enemy?.name, enemy?.level);
    });
    entitiesToLoad?.push(player?.get());
    const entitiesAssets = getEntitiesAssets(entitiesToLoad) ?? [];

    // Pushing all assets to an array
    const assets = [...entitiesAssets, ...hudAssets];

    // Loading assets
    loadAssets(assets);
  }, []);

  // On event **FIRST LOAD** only
  useEffect(() => {
    // Conditions to skip:
    if (!game.get().eventData.isFirstLoad || loading || location.pathname !== '/battle') return;

    // Every code written here will be called only one time in the game tick history, until I update the game eventData to default!
    console.log("event loaded for the first time");  // I'll keep this for debugging

    // Getting the event object
    const event = game.get()?.eventData?.event;
    
    // Updating the game eventData to be sure that the game first loaded
    game.update({ "eventData.isFirstLoad": false });

    // Spawning the enemies
    if (enemies.get().length < 1) {
      spawnEnemies(event?.enemiesToSpawn);
    }

    // Resetting the player's actions left
    player.update({ actionsLeft: player.get().actions }) 

    // Resetting the game music
    audios.get("gameMusic")?.stop()
  }, [loading]);

  // On game reload:
  useEffect(() => {
    if (loading) return;
    if (location.pathname === "/battle") navigate("/battle/action", { replace: true });

    // Starting the gameTick
    tick.start();

    // If is the first time entering the event (going to settings and get back will not have any effect)
    if (game.get().eventData.type === null) {
      game.update({ "eventData.type": "battle" });
      game.update({ "eventData.timeEntered": tick.get() });  // I have to keep an eye here
    }

    // Creating audios
    audios.create({ name: "gameMusic", src: "/assets/sounds/musics/the_music.ogg", loop: true, type: 'music' });
    audios.create({ name: "deathMusic", src: "/assets/sounds/musics/you_died.ogg", type: 'music' });
    audios.create({ name: "hitSound", src: "/assets/sounds/misc/hit_sound.ogg" });
    audios.create({ name: 'pointSound', src: '/assets/sounds/misc/point.ogg' });
    audios.create({ name: 'levelUp', src: '/assets/sounds/misc/level_up.ogg' });
    
    // Changing the animations tickSpeed to fit with the game tick
    player.update({ "animations.standBy.duration": game.get().tickSpeed })

    enemies.get().forEach((enemy) => {
      enemy.update({ "animations.standBy.duration": game.get().tickSpeed })
    })

    return () => {
      tick.stop();  // tick stops when the game exit the battle component
      audios.get("gameMusic")?.pause();
    };
    
  }, [loading]);

  // On event finish
  useEffect(() => {
    if (loading) return

    logic.finishEvent();

  }, [finishedEvent])

  // Starting the gameMusic
  useEffect(() => {
    if (loading) return;

    if (player.get().isDead()) return;
    if (!audios.get("gameMusic")?.isPlaying()) audios.get("gameMusic")?.play();
  }, [audios.get("gameMusic"), loading])

  // Checking if it's the player turn
  useEffect(() => {
    if (loading) return;

    if (game.get().specificEnemyTurn !== 'player') return;
      player.update({ actionsLeft: player.get().actions })  // resets the actionsLeft of the player
  }, [game.get().specificEnemyTurn]);

  // Checking if the player died
  useEffect(() => {
    if (loading) return
    if (player.get().isDead() && !audios.get("deathMusic")?.isPlaying()) {
      // Code if the player died and the death music is not playing anymore
      navigate("/deathscreen");
    }
  }, [audios.get("deathMusic")?.isPlaying()])

  // Checking if ALL enemies are dead
  useEffect(() => {
    if (loading) return;
    const aliveCount = enemies.get().reduce((acc, enemy) => {
      return enemy.stats.health > 0 ? acc + 1 : acc;
    }, 0);

    setEnemiesAlive(aliveCount);  // GAMBIARRA MALDITA

    // Finishing the battle event
    if (enemiesAlive === 0 && enemies.get().length > 0) setFinishedEvent(true);
  }, [enemies.get()]);

  // --- MAIN FUNCTIONS ---
  function createEntityObj(name, level = 1) {
    // Getting the base stats values
    const BASE_HEALTH = enemiesJson[name]['stats']['health'];
    const BASE_ATTACK = enemiesJson[name]['stats']['attack'];
    const BASE_DEFENSE = enemiesJson[name]['stats']['defense'];
    const GROWTH_RATE = 1.5;
    
    const entity = new Object({
      ...enemiesJson['commonProperties'],
      ...enemiesJson[name],
      "level": level,
      "animations": {
        ...enemiesJson[name]['animations'],
        ...enemiesJson['deathAnimation']
      },
      "stats": {
        ...enemiesJson[name]['stats'],
        // Stat = default * const(1.5) * level - 1 
        // Exemple:
        // snake lv 1 => health = 8
        // snake lv 2 => health = 12
        "maxHealth":  Math.floor(BASE_HEALTH * (1 + (level - 1) * (GROWTH_RATE - 1))),
        "health":     Math.floor(BASE_HEALTH * (1 + (level - 1) * (GROWTH_RATE - 1))),
        "attack":     Math.floor(BASE_ATTACK * (1 + (level - 1) * (GROWTH_RATE - 1))),
        "defense":    Math.floor(BASE_DEFENSE * (1 + (level - 1) * (GROWTH_RATE - 1))),
      }
    });
    
    return entity;
  }

  function spawnEnemies(enemiesToSpawn) {
    let enemiesObjs = [];
    enemiesToSpawn.forEach(enemy => {
      enemiesObjs.push(createEntityObj(enemy?.name, enemy?.level));
    })
    enemies.spawnEnemies(enemiesObjs);
  }

  // -- RETURNING THE GAME ---
  if (loading) return <Loading />
  return (
    <main id={styles['game']}>
      {/* VictoryModal */}
      {finishedEvent && <VictoryModal />}

      {/* TOP SECTION */}
      <section className={`${styles['x-section']} ${styles['top']}`}>
        <Header />
      </section>
  
      {/* MAP SECTION */}
      <section className={`${styles['x-section']} ${styles['map']}`}>
        <PlayerHUD />
        {enemies.get().length > 0 && <MapContainer map={funcs.getCurrentMap()}/>}
      </section>
      
      {/* STATS AND TERMINAL */}
      <section className={`${styles['x-section']} ${styles['statistics']}`}>
        <Routes>
          <Route path='action' element={<ActionSection />} />
          <Route path='inventory' element={<InventorySection />} />
          <Route path='skills' element={<SkillsSection />} />
        </Routes>
      </section>
  
      {/* ACTION BUTTONS */}
      <section className={`${styles['x-section']} ${styles['bottom']}`}>
        <SectionButtons
          sec1={() => navigate("action")} 
          sec2={() => navigate("inventory")}
          sec3={() => navigate("skills")}
          sec4={() => navigate("#")}
        />
      </section>
      
    </main>
  );
}

export default BattleEvent;
