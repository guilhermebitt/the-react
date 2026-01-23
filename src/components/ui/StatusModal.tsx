// Stylesheets
import styles from "./Status.module.css";

interface StatusModalProps {
  topPos: number;
  leftPos: number;
  title: string;
  description: string;
  flavor: string;
}

// Modal component
function StatusModal({topPos, leftPos, title, description, flavor}: StatusModalProps) {

  return (
    <div className={styles.statusModalContainer} style={{top: topPos, left: leftPos}}>
      <h2>{title}</h2>
      <p>{description}</p>
      <a>{flavor}</a>
    </div>
  )
}

export default StatusModal;