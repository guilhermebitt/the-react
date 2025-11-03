// Data
import settingsJson from "../../data/settings.json";

// Dependencies
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightRotate, faGear, faPauseCircle, faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, memo, useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";
import { produce } from "immer";

// Components
import OptionButtons from "../common/OptionButtons";

// Hooks
import { useStore } from "@/stores";

// Stylesheets
import styles from "./Header.module.css";

function Header() {
  const [showOptions, setShowOptions] = useState(false);
  const [volumeIcon, setVolumeIcon] = useState(faVolumeHigh);
  const [autoIcon, setAutoIcon] = useState(faArrowRightRotate);
  const [settings, setSettings] = useLocalStorage("settings", settingsJson);

  useEffect(() => {
    settings.muted === true ? setVolumeIcon(faVolumeMute) : setVolumeIcon(faVolumeHigh);
    settings.auto === true ? setAutoIcon(faArrowRightRotate) : setAutoIcon(faPauseCircle);
  }, [settings.muted, settings.auto]);

  const handleOptions = useCallback(() => {
    setShowOptions(!showOptions);
  }, [showOptions]);

  const mute = useCallback(() => {
    settings.muted
      ? setSettings(
          produce((draft) => {
            draft.muted = false;
          })
        )
      : setSettings(
          produce((draft) => {
            draft.muted = true;
          })
        );
  }, [settings.muted]);

  const auto = useCallback(() => {
    settings.auto
      ? setSettings(
          produce((draft) => {
            draft.auto = false;
          })
        )
      : setSettings(
          produce((draft) => {
            draft.auto = true;
          })
        );
        console.log(settingsJson);
  }, [settings.auto]);

  return (
    <header>
      <h1>The</h1>
      {/* SETTINGS BUTTON LOGIC */}
      {showOptions && (
        <div id={styles.options}>
          <OptionButtons />
        </div>
      )}
      <div className={styles["h-btn-container"]}>
        <button onClick={mute} className={styles["icon-btn"]}>
          <FontAwesomeIcon id={styles["music-icon"]} icon={volumeIcon} />
        </button>
        <button onClick={auto} className={styles["icon-btn"]}>
          <FontAwesomeIcon id={styles["auto-icon"]} icon={autoIcon} />
        </button>
        <button onClick={handleOptions} className={styles["icon-btn"]}>
          <FontAwesomeIcon
            id={styles["gear-icon"]}
            className={showOptions ? styles.rotate : styles.noRotate}
            icon={faGear}
          />
        </button>
      </div>
    </header>
  );
}

export default memo(Header);
