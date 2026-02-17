// Dependencies
import { useState, useEffect, useRef } from "react"
import { useStore } from "@/stores"
import { createPortal } from "react-dom";

// Components
import ComponentBorder from "../ui/ComponentBorder"
import Stats from "../ui/Stats"

// Stylesheet
import styles from './sections.module.css'
import { position } from "html2canvas/dist/types/css/property-descriptors/position"

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
  // This state will control which slots are selected by they ID.
  const [eqSlotSelected, setEqSlotSelected] = useState<number>();

  return (
    <ComponentBorder title="Equipments">
      <div className={styles.equipments}>
        <img src="/public/assets/hud/hero_base.png" alt="hero sprite but all white" className={styles.eqImg}/>

        {/* Equipments Slots */}
        {/* Armor */}
        <div className={styles.eqArmor}>
          {Array.from({ length: 4 }).map((_, i) => (
            <EqSlot key={i} id={i} select={setEqSlotSelected} selected={eqSlotSelected}/>
          ))}
        </div>
        {/* Others */}
        <div className={styles.eqOthers}>
          {Array.from({ length: 4 }).map((_, i) => (
            <EqSlot key={i+4} id={i+4} select={setEqSlotSelected} selected={eqSlotSelected}/>
          ))}
        </div>
      </div>
    </ComponentBorder>
  )
}

// Part of the inventory itself
function Inventory() {
  // This state will control which slots are selected by they ID.
  const [slotSelected, setSlotSelected] = useState<number>();
 
  return (
    <ComponentBorder title="Inventory">
      <div className={styles.inventory}>
        {/* Adding 36 Slot components */}
        {Array.from({ length: 36 }).map((_, i) => (
          <Slot key={i} id={i} select={setSlotSelected} selected={slotSelected}/>
        ))}
      </div>
    </ComponentBorder>
  );
}

// Inventory slot
function Slot({id, select, selected}: {id: number, select: Function, selected: number | undefined}) {
  // Modal position
  const [modal, setModal] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  });

  // Getting the slot data of the inventory by the id in the store
  const inv = useStore("inventory", "actions")

  const slotItem = useStore("inventory", (s) => s.inventory[id]?.item)

  const handleDragStart = (id: number) => {
    inv.setDraggedIndex(id);
  };

  const handleDrop = (id: number) => {
    inv.moveItem(id);
  };

  return (
    <div style={{position: "relative"}}>
      {(id === selected) && <Modal mousePosX={modal.x} mousePosY={modal.y} close={() => select(undefined)} slotId={id} />}
      <div
        draggable={slotItem && true}
        onDragStart={() => handleDragStart(id)}
        onDragOver={(e) => e.preventDefault()}  // this is very important
        onDrop={() => handleDrop(id)}

        onContextMenu={(e) => {
          e.preventDefault();
          setModal({
            x: e.clientX,
            y: e.clientY
          });
          // Updates the selected array to the ID of this slot
          slotItem && select(id)
        }}

        className={styles.slot}
      >
        {slotItem?.imagePath && <img src={slotItem?.imagePath} alt="" draggable={true}/>}
      </div>
    </div>
  )
}

// Equipments slot
function EqSlot({id, select, selected}: {id: number, select: Function, selected: number | undefined}) {
  // Modal position
  const [modal, setModal] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  });

  const inv = useStore("inventory", "actions")
  const equipment = useStore("inventory", (s) => s.equipments[id].item)

  const handleDragStart = (id: number) => {
    inv.setDraggedIndex(id, "equipments");
  };

  const handleDrop = (id: number) => {
    inv.moveItem(id, "equipments");
  };

  return (
    <div style={{position: "relative"}}>
      {(id === selected) && <Modal mousePosX={modal.x} mousePosY={modal.y} close={() => select(undefined)} slotId={id} where="equipments"/>}
      <div
        draggable={equipment && true}
        onDragStart={() => handleDragStart(id)}
        onDragOver={(e) => e.preventDefault()}  // this is very important
        onDrop={() => handleDrop(id)}

        onContextMenu={(e) => {
          e.preventDefault();
          setModal({
            x: e.clientX,
            y: e.clientY
          });
          // Updates the selected array to the ID of this slot
          equipment && select(id)
        }}

        className={styles.slot}
      >
        {equipment?.imagePath && <img src={equipment?.imagePath} alt="" draggable={true}/>}
      </div>
    </div>
  )
}

// Item modal
function Modal({mousePosX, mousePosY, close, slotId, where="inventory"}: {mousePosX: number, mousePosY: number, close: () => void, slotId: number, where?: "inventory" | "equipments"}) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Getting the slot from inv
  const inv = useStore("inventory", "actions");
  const item = inv.getCurrent(where)[slotId].item;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [close]);

  const handleDelete = () => {
    // ------- NEED TO MAKE A CONFIRMATION MODAL BEFORE DELETING!!!!!!!! -------

    // Removing the item from the slot
    inv.removeItem(slotId, where);

    // Closing the modal
    close();
  }

  return createPortal(
    <div
      ref={modalRef}
      className={styles.modal}
      style={{top: mousePosY, left: mousePosX}}
    >
      {/* USE ITEM */}
      {item?.type === "consumable" && 
        <button>
          Use
        </button>
      }
      {/* EQUIP ITEM */}
      {(item?.type === "weapon" && where !== "equipments") && 
        <button onClick={() => {inv.equipItem(item, slotId); close()}}>
          Equip
        </button>
      }
      {/* UNEQUIP */}
      {(item && where === "equipments") && 
        <button onClick={() => {inv.unequipItem(item, slotId); close()}}>
          Unequip
        </button>
      }
      {/* DELETE */}
      <button id={styles.delete} onClick={handleDelete}>
        Delete
      </button>
    </div>,
    document.body
  )
}
