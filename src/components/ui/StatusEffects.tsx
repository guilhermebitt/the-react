// Dependencies
import { useState, useEffect } from "react";
import { useStatusLogic } from "@/logic/statusLogic";

// Components
import StatusModal from "./StatusModal";

// Types
import { StatusUnion } from "@/types"

// Stylesheets
import styles from "./Status.module.css";

// Props interface
interface ActiveStatusProps {
  status: StatusUnion;
}

function ActiveStatus({ status }: ActiveStatusProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const { createDescription } = useStatusLogic();

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
      className={styles.statusHolder} 
      onMouseEnter={handleMouseEnter} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
    >

    <img className={styles.statusImg} src={status?.iconURL ?? "/assets/perks/unknown.png"} />
    <p className={styles.statusCount}>x{status.stackCount}</p>
      {visible &&
        <StatusModal
          topPos={position.y + 10}
          leftPos={position.x + 10}
          title={`${status.name}`}
          description={createDescription(status.description, status.translates)}
        />
      }
    </div>
  )
}

export default ActiveStatus;
