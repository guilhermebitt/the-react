// Dependencies
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Hooks
import { useGame } from '../../hooks/useGame';

// Stylesheets
import styles from './EventBadge.module.css';

// Defining the badges URL
var badgesUrl = [
  "/assets/map_sections/events_badges/battle_badge.png",
  "/assets/map_sections/events_badges/shop_badge.png",
  "/assets/map_sections/events_badges/unknown_badge.png"
];

function EventBadge({ badge }) {
  const [BadgeUrl, setBadgeUrl] = useState('');
  const navigate = useNavigate();
  const { game } = useGame();

  useEffect(() => {
    // Verifying if there is a type
    if (!badge?.type) {
      console.warn('⚠️ Type of event not defined.');
      return;
    } else {
      switch (badge?.type) {
        case 'battle': setBadgeUrl(badgesUrl[0]); break;
        case 'shop': setBadgeUrl(badgesUrl[1]); break;
        case 'unknown': setBadgeUrl(badgesUrl[2]); break;
        default:
          console.warn('⚠️ Type of event does not exist: ', badge?.type);
          return;
      }
    }
  }, []);

  function handleEvent() {
    // If the event as already finished, skip
    if (badge?.isFinished) return;

    // Updating the path to the event
    game.update({ "eventData.path": badge?.path });

    // Updating the event object
    game.update({ "eventData.event": badge });

    navigate(badge?.path);
  }

  return (
    <div className={styles.eventBadgeContainer}>
      <img className={styles.eventImage} src={BadgeUrl} onClick={handleEvent}/>
    </div>
  );
}

export default EventBadge;
