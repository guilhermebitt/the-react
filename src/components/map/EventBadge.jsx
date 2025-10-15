// Dependencies
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Hooks
import { useGame } from '../../hooks/useGame';

// Stylesheets
import styles from './EventBadge.module.css';

// Defining the badges URL
var badgesUrl = [
  '/assets/map_sections/events_badges/battle_badge.png',
  '/assets/map_sections/events_badges/shop_badge.png',
  '/assets/map_sections/events_badges/unknown_badge.png',
  '/assets/map_sections/events_badges/boss_badge.png',
];

function EventBadge({ badge }) {
  const [badgeUrl, setBadgeUrl] = useState('');
  const navigate = useNavigate();
  const { game } = useGame();

  useEffect(() => {
    // Verifying if there is a type
    if (!badge?.type) {
      console.warn('⚠️ Type of event not defined.');
      return;
    } else {
      switch (badge?.type) {
        case 'battle':
          setBadgeUrl(badgesUrl[0]);
          break;
        case 'shop':
          setBadgeUrl(badgesUrl[1]);
          break;
        case 'unknown':
          setBadgeUrl(badgesUrl[2]);
          break;
        case 'bossBattle':
          setBadgeUrl(badgesUrl[3]);
          break;
        default:
          console.warn('⚠️ Type of event does not exist: ', badge?.type);
          return;
      }
    }
  }, []);

  function handleEvent() {
    // If the event as already finished, skip
    if (badge?.isFinished) return;
    if (!game.get().eventsEnabled.includes(badge?.eventId)) return;

    // Getting the sections
    const section = game.get()?.mapArea[game.get()?.currentMapSection];
    const nextSection = game.get()?.mapArea[game.get()?.currentMapSection + 1];

    // Getting the side to block
    const otherSide = badge?.eventId === section?.events[0]?.eventId ? 1 : 0;

    // Getting the Id of the event in the next section
    const blockIds = [nextSection?.events[otherSide]?.eventId, section?.events[otherSide]?.eventId];

    const blockEventPaths = blockIds.map((blockId) => {
      return game.findEventPath(blockId);
    });

    // Blocking the side in the nextSection ONLY IF THE NEXT SECTION HAS TWO EVENTS (and the current too)!
    if (nextSection?.events?.length > 1 && section?.events?.length > 1) {
      game.update({
        [blockEventPaths[0]]: (prev) => ({ ...prev, isFinished: true }),
      });
    }
    game.update({
      [blockEventPaths[1]]: (prev) => ({ ...prev, isFinished: true }),
    });

    // Checking if the map section have more than one badge
    if (section?.events?.length > 1) {
    }

    // Updating the path to the event
    game.update({ 'eventData.path': badge?.path });

    // Updating the event object
    game.update({ 'eventData.event': badge });

    // Traveling to the event
    navigate(badge?.path);
  }

  return (
    <div className={styles.eventBadgeContainer}>
      <img
        className={`${styles.eventImage} ${game.get()?.eventsEnabled?.includes(badge?.eventId) && styles.canSelect}`}
        src={badgeUrl}
        onClick={handleEvent}
      />
    </div>
  );
}

export default EventBadge;
