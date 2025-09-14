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
import gameData from '../data/game.json' with { type: 'json' };

// Dependencies
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import * as funcs from '../utils/functions.js';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Components
import MapContainer from '../components/game/MapContainer.jsx';
import SectionButtons from '../components/common/SectionButtons.jsx';
import Header from '../components/game/Header.jsx';
import PlayerHUD from '../components/ui/PlayerHUD.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import Loading from '../components/common/Loading.jsx';
import ActionSection from '../components/sections/ActionSection.jsx';
import InventorySection from '../components/sections/InventorySection.jsx';
import SkillsSection from '../components/sections/SkillsSection.jsx';
import VictoryModal from '../components/ui/VictoryModal.jsx';

// Hooks
import { useGame } from '../hooks/useGame.js';

// Stylesheet
import styles from'./BattleEvent.module.css';



function BattleEvent() {
  // React Hooks
  const { tick, audios, player, enemies, game } = useGame();
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    message: 'Are you sure?',
    onConfirm: null,
    onCancel: null
  });
  const [enemiesAlive, setEnemiesAlive] = useState(null);
  const [finishedEvent, setFinishedEvent] = useState(false);

  // Setting the localStorage
  const [loading, setLoading] = useLocalStorage('loading', true);

  // Initializing funcs
  funcs.init(game);

  // On event **FIRST LOAD** only
  useEffect(() => {
    // Verifying if the event as already loaded for the first time
    if (!game.get().eventData.isFirstLoad || loading) return;

    // Every code written here will be called only one time in the game tick history, until I update the game eventData to default!
    console.log("event loaded for the first time");  // I'll keep this for debugging

    // Resetting all game eventData
    game.update({ "eventData": gameData.eventData });

    // Updating the game eventData to be sure that the game first loaded
    game.update({ "eventData.isFirstLoad": false });
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

    // THIS IS TEMPORARY!!!!!! (just to spawn enemies for the first time)
    // This will be executed when the game start for the first time
    if (enemies.get().length < 1) {
      spawnEnemies();
    };

    // Creating audios
    audios.create({ name: "gameMusic", src: "/assets/sounds/musics/the_music.ogg", loop: true, type: 'music' });
    audios.create({ name: "deathMusic", src: "/assets/sounds/musics/you_died.ogg", type: 'music' });
    audios.create({ name: "hitSound", src: "/assets/sounds/misc/hit_sound.ogg" });
    audios.create({ name: 'pointSound', src: '/assets/sounds/misc/point.ogg' });
    
    // Changing the animations tickSpeed to fit with the game tick
    player.update({ "animations.standBy.duration": game.get().tickSpeed })

    enemies.get().forEach((enemy) => {
      enemy.update({ "animations.standBy.duration": game.get().tickSpeed })
    })

    return () => {
      setLoading(true);
      tick.stop();  // If the player is not on the Game component, the tick will stop counting
    };
    
  }, [loading]);

  // Starting the gameMusic
  useEffect(() => {
    if (loading) return;

    if (player.get().isDead()) return;
    if (!audios.get("gameMusic")?.isPlaying()) audios.get("gameMusic")?.start();
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
  function confirmScreen(onConfirm, onCancel, msg='Are you sure?') {
    setConfirmDialog({
      visible: true,
      message: msg,
      onConfirm: onConfirm || (() => {}),
      onCancel: onCancel || (() => setConfirmDialog(prev => ({ ...prev, visible: false }))),
    });
  }

  function createEntityObj(name) {
    const entity = new Object({
      ...enemiesJson['commonProperties'],
      ...enemiesJson[name],
      "animations": {
        ...enemiesJson[name]['animations'],
        ...enemiesJson['deathAnimation']
      }
    });
    
    return entity;
  }

  function spawnEnemies() {
    const snake = createEntityObj('snake');
    enemies.spawnEnemies([snake, snake, snake])
  }

  // -- RETURNING THE GAME ---
  if (loading) return <Loading enemies={enemies.get()} player={player.get()} mapSrc={funcs.getCurrentMap().src}/>
  return (
    <main id={styles['game']}>
      {/* VictoryModal */}

      {finishedEvent && <VictoryModal />}

      {/* CONFIRM DIALOG */}
     <ConfirmDialog 
        visible={confirmDialog.visible}
        message={confirmDialog.message}
        onConfirm={() => {
          confirmDialog.onConfirm?.();
          setConfirmDialog(prev => {return{...prev, visible: false}});
        }}
        onCancel={() => {
          confirmDialog.onCancel?.();
          setConfirmDialog(prev => {return{...prev, visible: false}});
        }}
      />

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
