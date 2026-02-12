// Dependencies
import { useState, useEffect } from "react"
import { useStore } from "@/stores"

// Components
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
      WIP
    </ComponentBorder>
  )
}

// Part of the inventory itself
function Inventory() {
  // This state will control which slots are selected by they ID.
  // NOTE: this will be a array because, in the future, maybe you going to be able to hold control to select
  // more than one slot per time.
  /* const [slotsSelected, setSlotsSelected] = useState<number[]>([]);

  useEffect(() => {console.log("inventory slots selected:", slotsSelected)}, [slotsSelected])
 */
  return (
    <ComponentBorder title="Inventory">
      <div className={styles.inventory}>
        {/* Adding 36 Slot components */}
        {Array.from({ length: 36 }).map((_, i) => (
          <Slot key={i} id={i} select={() => {}}/>
        ))}
      </div>
    </ComponentBorder>
  );
}

// Inventory slot (for equipments and inventory)
function Slot({id, select}: {id: number, select: Function}) {
  // Getting the slot data of the inventory by the id in the store
  const slotItem = useStore("inventory", (s) => s.inventory[id].item)

  return (
    <div 
      className={styles.slot}
      // Updates the selected array to the ID of this slot
      onClick={() => select([id])}
    >
      {slotItem?.imagePath && <img src={slotItem?.imagePath} alt="" draggable={true}/>}
    </div>
  )
}