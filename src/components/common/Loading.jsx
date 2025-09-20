// Dependencies
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// Stylesheet
import styles from './Loading.module.css';



// In the future, when I improve the audio system , I gonna change this
const audioAssets = [
  "/assets/sounds/musics/the_music.ogg",
  "/assets/sounds/musics/you_died.ogg",
  "/assets/sounds/misc/hit_sound.ogg",
]
// Temporary, manually adds the assets to be loaded from the Loading component
const hudAssets = [
  "assets/hud/coin.png",
  "assets/hud/heart.png",
  "assets/hud/shield.png",
  "assets/hud/sword.png",
  "assets/hud/stamina.png",
  "assets/images/star-solid-full.svg"
]



function Loading() {
  return (
    <div className={styles.loadContainer}>
      <FontAwesomeIcon icon={faSpinner} className={styles.spinner}/>
    </div>
  );
}

export default Loading;