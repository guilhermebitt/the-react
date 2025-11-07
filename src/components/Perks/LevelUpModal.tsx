// Dependencies
import { usePerkLogic } from "@/logic/usePerkLogic";
import { memo, useEffect } from "react";
import { useStore } from "@/stores";

// Stylesheets
import styles from "./LevelUpModal.module.css";
import { Perk } from "@/types";

// Perks, just for testing
let perks = [
{
  "id": "critEye",
  "name": "Crit Eye",
  "description": "Increases the critic attack chance by {critChance}%",
  "rarity": "common",
  "iconURL": "/assets/perks/battle/crit_eye.png",

  "stackCount": 1,
  "maxStackCount": 10,

  "category": "battle",
  "effects": {
    "increases": {
      "critChance": 2
    }
  }
} as Perk,
{
  "id": "critEye",
  "name": "Crit Eye",
  "description": "Increases the critic attack chance by {critChance}%",
  "rarity": "common",
  "iconURL": "/assets/perks/battle/crit_eye.png",

  "stackCount": 1,
  "maxStackCount": 10,

  "category": "battle",
  "effects": {
    "increases": {
      "critChance": 2
    }
  }
} as Perk,
{
  "id": "critEye",
  "name": "Crit Eye",
  "description": "Increases the critic attack chance by {critChance}%",
  "rarity": "common",
  "iconURL": "/assets/perks/battle/crit_eye.png",

  "stackCount": 1,
  "maxStackCount": 10,

  "category": "battle",
  "effects": {
    "increases": {
      "critChance": 2
    }
  }
} as Perk,
]

// Level up Component
function LevelUpModal() {
  const perkLogic = usePerkLogic();

  const showModal = useStore("game", s => s.game.showLevelUpModal);
  const game = useStore("game", "actions");

  useEffect(() => {
    if (showModal === true) return;
    perks = perkLogic.generatePerks();
  }, [showModal])

  const handleChoosePerk = (perk: Perk) => {
    if (game.getCurrent().perks[perk.id]?.stackCount === perk.maxStackCount) return;
    // Creating the new perk and adding it to perks array
    perkLogic.createPerk(perk.id);

    // Changing the show modal to false
    game.update({ showLevelUpModal: false });
  }

  // Returning the modal only if the show modal is true
  return showModal && (
    <div className="backdrop">
      {/* Modal container */}
      <div className={styles.levelUpBox}>
        {/* Title and tiny message */}
        <h2><span>Level Up!</span></h2>
        <p>You can choose one perk to gain.</p>
        {/* Perks container */}
        <div className={styles.perksContainer}>
          {/* Perk container */}
          {perks.map((perk, index) => {
            // Returning the perk div
            return (
              <div key={index} className={styles.perkBox} onClick={() => handleChoosePerk(perk)}>
                {/* Title */}
                <h3><span>{perk.name} {game.getCurrent().perks[perk.id]?.stackCount === perk.maxStackCount && "(MAX)"}</span></h3>
                {/* Image */}
                <img src={perk.iconURL} alt="" />
                {/* Description */}
                <p>{perkLogic.createDescription(perk.description, perk.translates)}</p>
              </div>
            )
          })}
        </div>
        {/* Button to skip the modal */}
        <button onClick={() => game.update({ showLevelUpModal: false })}>Skip</button>
      </div>
    </div>
  )
}

export default memo(LevelUpModal);