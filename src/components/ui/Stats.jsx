// Dependencies
import { useEffect, useState } from "react";

// Stylesheets
import '../../assets/css/components_style/Stats.css';



function Stats({entity}) {

  const [healthPercent, setHealthPercent] = useState(100);
  const [staminaPercent, setStaminaPercent] = useState(100);

  useEffect(() => {
    setHealthPercent(calcPercent(entity?.stats?.health, entity?.stats?.maxHealth));
  }, [entity?.stats.health]);

  useEffect(() => {
    setStaminaPercent(calcPercent(entity?.stats?.stamina, entity?.stats?.maxStamina));
  }, [entity?.stats.stamina]);

  const calcPercent = (hp, maxHp) => (hp / maxHp) * 100;

  return (
    <div className="stats-container">
      {/* HEALTH BAR */}
      <div className="bar-container">
        <img src="./assets/hud/heart.png" alt="" />
        <div className="bar-bg">
          <p>{entity?.stats?.health}/{entity?.stats?.maxHealth}</p>
          <div
            className="hp fill"
            style={{
              width: `${healthPercent}%`
            }}
          />
        </div>
      </div>
      {/* STAMINA BAR */}
      <div className="bar-container">
        <img src="./assets/hud/stamina.png" alt="" />
        <div className="bar-bg">
          <p>{entity?.stats?.stamina}/{entity?.stats?.maxStamina}</p>
          <div
            className="stm fill"
            style={{
              width: `${staminaPercent}%`
            }}
          />
        </div>
      </div>
      {/* PLAYER STATS */}
      <div className="stats">
        <div className="stat-holder">
          <img src="./assets/hud/sword.png" alt="" />
          <p>Str | Atk: <span>{entity?.stats?.strength} | {entity?.stats?.attack}</span></p>
        </div>
        <div className="stat-holder">
          <img src="./assets/hud/shield.png" alt="" />
          <p>Con | Def: <span>{entity?.stats?.constitution} | {entity?.stats?.defense}</span></p>
        </div>
        {
        entity?.name === "Player" && 
        <div className="stat-holder">
          <img src="./assets/hud/coin.png" alt="" />
          <p>Money: <span>{entity?.stats?.money}</span></p>
        </div>
        }
        
      </div>
    </div>
  );
};

export default Stats;