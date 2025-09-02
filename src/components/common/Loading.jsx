// Dependencies
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useLocalStorage } from 'usehooks-ts';
import { useState, useEffect } from 'react';
import { getEntitiesAssets } from '../../utils/loadAssets.js';

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


function Loading({ enemies, player, mapSrc }) {
  const [loadingCounter, setLoadingCounter] = useState(-1);  // The minus one makes the code don't get loading as false
  const [, setLoading] = useLocalStorage('loading', true);

  useEffect(() => {
    const allEntities = [...enemies, player];
    const entitiesAssets = getEntitiesAssets(allEntities);  // getting the entities assets to load
    const imgsToLoad = [...entitiesAssets, mapSrc, ...hudAssets];
    const assetsNumber = imgsToLoad.length + audioAssets.length;

    setLoadingCounter(assetsNumber);  // Starting the assets counter

    // preloading images
    imgsToLoad.forEach(src => {
      preloadImage(
        src,
        () => setLoadingCounter(prev => prev - 1),
        () => setLoadingCounter(prev => prev - 1) // error also counts
      );
    });

    // Preloading audios
    audioAssets.forEach(src => {
      const audio = new Audio(src);
      audio.addEventListener("canplaythrough", () => {
        setLoadingCounter(prev => prev - 1);
      }, { once: true });
      audio.load(); // força carregar
    });

  }, []);

  // Finishing the loading
  useEffect(() => {
    if (loadingCounter === 0) setLoading(false);
  }, [loadingCounter]);

  // Functions that do all the magic (load the assets)
  function preloadImage(src, onLoad, onError) {
    const img = new Image();
    img.src = src;
    img.onload = onLoad;  // function if the image as loaded
    img.onerror = onError;  // function if the image had an error
  }

  return (
    <div className={styles.loadContainer}>
      <FontAwesomeIcon icon={faSpinner} className={styles.spinner}/>
    </div>
  );
}



export default Loading;
