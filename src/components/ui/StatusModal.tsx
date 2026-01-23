// Stylesheets
import styles from "./Status.module.css";

interface StatusModalProps {
  topPos: number;
  leftPos: number;
  title: string;
  description: string;
}

// Modal component
function StatusModal({topPos, leftPos, title, description}: StatusModalProps) {

  return (
    <div className={styles.statusModalContainer} style={{top: topPos, left: leftPos}}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

export default StatusModal;