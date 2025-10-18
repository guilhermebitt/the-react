// Stylesheets
import styles from "./PerkModal.module.css";

interface PerkModalProps {
  topPos: number;
  leftPos: number;
  title: string;
  description: string;
}

// Modal component
function PerkModal({topPos, leftPos, title, description}: PerkModalProps) {

  return (
    <div className={styles.perkModalContainer} style={{top: topPos, left: leftPos}}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

export default PerkModal;