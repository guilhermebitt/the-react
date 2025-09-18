// Dependencies
import { useEffect, useState } from 'react';

// Stylesheets
import styles from './EventBadge.module.css';

// Defining the badges URL
var badgesUrl = [
  "/assets/map_sections/events_badges/battle_badge.png",
  "/assets/map_sections/events_badges/shop_badge.png",
  "/assets/map_sections/events_badges/unknown_badge.png"
];

function EventBadge({ type }) {
  const [BadgeUrl, setBadgeUrl] = useState('');

  useEffect(() => {
    // Verifying if there is a type
    if (!type) {
      console.warn('⚠️ Type of event not defined!');
      return;
    } else {
      switch (type) {
        case 'battle': setBadgeUrl(badgesUrl[0]); break;
        case 'shop': setBadgeUrl(badgesUrl[1]); break;
        case 'unknown': setBadgeUrl(badgesUrl[2]); break;
        default:
          console.warn('⚠️ Type of event not defined!');
          return;
      }
    }
  }, []);

  return (
    <div className={styles.eventBadgeContainer}>
      <img className={styles.eventImage} src={BadgeUrl} />
    </div>
  );
}

export default EventBadge;
