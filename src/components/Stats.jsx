// Dependencies
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

// Stylesheets
import '../assets/css/components_style/Stats.css';



function Stats({entity}) {

  const [healthPercent, setHealthPercent] = useState(100);
  const [staminaPercent, setStaminaPercent] = useState(100);

  useEffect(() => {
    console.log(entity?.stats?.maxHealth);
    setHealthPercent(calcPercent(entity?.stats?.health, entity?.stats?.maxHealth));
  }, [entity?.stats.health]);

  useEffect(() => {
    console.log(entity?.stats?.maxStamina);
    setStaminaPercent(calcPercent(entity?.stats?.stamina, entity?.stats?.maxStamina));
  }, [entity?.stats.stamina]);

  const calcPercent = (hp, maxHp) => {
    console.log(hp, maxHp);
    return (hp / maxHp) * 100;
  }

  return (
    <div className="stats-container">
      {/* HEALTH BAR */}
      <div className="bar-container">
        <h4>Health</h4>
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
        <h4>Stamina</h4>
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
          <p>Attack: <span>{entity?.stats?.attack}</span></p>
        </div>
        <div className="stat-holder">
          <img src="./assets/hud/shield.png" alt="" />
          <p>Defense: <span>{entity?.stats?.defense}</span></p>
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