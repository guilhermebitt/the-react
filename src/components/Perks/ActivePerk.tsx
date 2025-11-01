// Dependencies
import { useState, useEffect } from "react";
import { usePerkLogic } from "@/logic/usePerkLogic";

// Components
import PerkModal from "./PerkModal";

// Types
import { PerkUnion } from "@/types"

// Stylesheets
import styles from "./ActivePerk.module.css";

// Props interface
interface ActivePerkProps {
  perk: PerkUnion;
}

// Perk component
function ActivePerk({ perk }: ActivePerkProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const { createDescription } = usePerkLogic();

  const handleMouseEnter = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
    setVisible(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // atualiza posição em tempo real
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  return (
    <div 
      className={styles.perkContainer} 
      onMouseEnter={handleMouseEnter} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
    >
      <img className={styles.perkImg} src={perk?.iconURL ?? "/assets/perks/unknown.png"} />
      <p className={styles.perkCount}>x{perk.stackCount}</p>
      {visible &&
        <PerkModal
          topPos={position.y + 10}
          leftPos={position.x + 10}
          title={`${perk.name} ${(perk.stackCount >= perk.maxStackCount) ? "(MAX)" : ""}`}
          description={createDescription(perk.description, perk.translates)}
        />
      }
    </div>
  )
}

export default ActivePerk;
