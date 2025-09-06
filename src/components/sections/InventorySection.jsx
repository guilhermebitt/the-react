//Components
import ComponentBorder from "../ui/ComponentBorder"

// Stylesheet
import styles from './sections.module.css'

function InventorySection() {
  return (
    <ComponentBorder title="Inventory">
      <div className={styles.invContainer}></div>
    </ComponentBorder>
  )
}

export default InventorySection