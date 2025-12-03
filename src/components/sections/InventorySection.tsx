//Components
import ComponentBorder from "../ui/ComponentBorder"
import Stats from "../ui/Stats"

// Stylesheet
import styles from './sections.module.css'

function InventorySection() {
  return (
    <div className={styles.invContainer}>
      {/* Player equipments (e.g. armor, weapons, charms) */}
      <Equipments />
      {/* Items that can be found at the gameplay */}
      <Inventory />
      {/* Stats of the player */}
      <Stats />
    </div>
  )
}

export default InventorySection

// Part of the players equipments
function Equipments() {
  return (
    <ComponentBorder title="Equipments">
      
    </ComponentBorder>
  )
}

// Part of the inventory itself
function Inventory() {
  return (
    <ComponentBorder title="Inventory">
      <div className={styles.inventory}>
        {Array.from({ length: 36 }).map((_, i) => (
          <Slot key={i} />
        ))}
      </div>
    </ComponentBorder>
  );
}
// Inventory slot (for equipments and inventory)
function Slot() {
  return (
    <div className={styles.slot}>
      
    </div>
  )
}