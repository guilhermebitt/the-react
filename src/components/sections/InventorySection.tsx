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
  return (
    <ComponentBorder title="Equipments">
      WIP
    </ComponentBorder>
  )
}

// Part of the inventory itself
function Inventory() {
  // This state will control which slots are selected by they ID.
  const [slotSelected, setSlotSelected] = useState<number>();

  //useEffect(() => {console.log("inventory slots selected:", slotSelected)}, [slotSelected])
 
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

// Inventory slot (for equipments and inventory)
function Slot({id, select, selected}: {id: number, select: Function, selected: number | undefined}) {
  // Modal position
  const [modal, setModal] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  });

  // Getting the slot data of the inventory by the id in the store
  const inv = useStore("inventory", "actions")

  const slotItem = useStore("inventory", (s) => s.inventory[id].item)

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

// Item modal
function Modal({mousePosX, mousePosY, close, slotId}: {mousePosX: number, mousePosY: number, close: () => void, slotId: number}) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Getting the slot from inv
  const inv = useStore("inventory", "actions");
  const item = inv.getCurrent()[slotId].item;

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
    inv.removeItem(slotId);

    // Closing the modal
    close();
  }

  return createPortal(
    <div
      ref={modalRef}
      className={styles.modal}
      style={{top: mousePosY, left: mousePosX}}
    >
      {item?.type === "consumable" && 
        <button>
          Use item
        </button>
      }
      {item?.type === "weapon" && 
        <button>
          Equip
        </button>
      }
      <button id={styles.delete} onClick={handleDelete}>
        Delete
      </button>
    </div>,
    document.body
  )
}
