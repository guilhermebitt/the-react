// Dependencies
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // This is temporary

// Components
import ValueIncrement from "../ui/ValueIncrement.jsx";

// Hooks
import { useGame } from "../../hooks/useGame";
import { useStore } from '@/stores';

// Stylesheet
import styles from "./VictoryModal.module.css";

function VictoryModal() {
  const { game } = useGame();
  const [eventTime, setEventTime] = useState(null);
  const [finished, setFinished] = useState(false);
  const [timeForEach] = useState(1000); // Time in MS to determine the time for each stat
  const [infoId, setInfoId] = useState(0);
  // Store
  const getCurrentTick = useStore("tick", state => state.getCurrent);

  useEffect(() => {
    if (!eventTime) setEventTime(getEventTime());

    // Changes the id after the time pass
    let times = 0;
    const interval = setInterval(() => {
      setInfoId((prev) => prev + 1);
      times++;
      if (times >= 2) clearInterval(interval);
    }, timeForEach);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (infoId >= 2) setFinished(true);
  }, [infoId]);

  function getEventTime() {
    const timeEntered = game.get().eventData.timeEntered;
    const currentTime = getCurrentTick();

    const timeInEvent = currentTime - timeEntered;

    //return funcs.tickToTime(timeInEvent, game.get().tickSpeed);
    return timeInEvent;
  }

  return (
    <div className="backdrop">
      <div className={styles.container}>
        <p>You Win</p>

        <div className={styles.info}>
          {/* EVENT TIME */}
          {(infoId ?? 0) >= 0 && (
            <p
              style={{
                visibility: (infoId ?? 0) >= 0 ? "visible" : "hidden",
              }}>
              Event Duration: {<ValueIncrement finalValue={eventTime} duration={timeForEach} type={"time"} />}
            </p>
          )}
          {/* ENEMIES KILLED */}
          {infoId >= 1 && (
            <p
              style={{
                visibility: infoId >= 1 ? "visible" : "hidden",
              }}>
              Enemies Killed: {<ValueIncrement finalValue={game.get().eventData.kills} duration={timeForEach} />}
            </p>
          )}
        </div>

        <div className={styles.buttons}>
          {/* This is temporary */}
          <Link to="/mapscreen">
            <button disabled={finished ? false : true}>Continue</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VictoryModal;
