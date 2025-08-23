// Dependencies
import { useEffect, useState } from "react";

// Stylesheets
import '../assets/css/components_style/Stats.css';



function HealthBar({entity}) {

  const [healthPercent, setHealthPercent] = useState(100);

  useEffect(() => {
    setHealthPercent(calcPercent(entity?.stats?.health, entity?.stats?.maxHealth));
  }, [entity?.stats.health]);

  const calcPercent = (hp, maxHp) => (hp / maxHp) * 100;

  return (
    <div className="bar-container">
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
  );
};

export default HealthBar;