// Dependencies
import { useStore } from "@/stores";

//Components
import ComponentBorder from "../ui/ComponentBorder";
import ActivePerk from "../Perks/ActivePerk";

// Stylesheet
import styles from './sections.module.css';
import '@/assets/css/scrollbar.css';

function PerksSection() {
  const perks = useStore("game", s => s.game.perks)
  return (
    <ComponentBorder title="Active Perks">
      <div className={`${styles.perksContainer} scrollbar`}>
        {Object.entries(perks).map((entry, index) => {
          return <ActivePerk key={index} perk={entry[1]}/>
        })}
      </div>
    </ComponentBorder>
  )
}

export default PerksSection;
