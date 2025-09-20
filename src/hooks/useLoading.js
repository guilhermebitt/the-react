// Dependencies
import { useState, useEffect } from "react";



export const useLoading = () => {
  const [loadingCounter, setLoadingCounter] = useState(-1);  // The minus one makes the code don't get loading as false
  const [loading, setLoading] = useState(true);

  const loadAssets = (imgsToLoad=[], audiosToLoad=[]) => {
    // Verifying if there is any asset to load
    if (imgsToLoad.length < 1) {
      console.warn("⚠️ There aren't any image to load!");
    }
    if (audiosToLoad.length < 1) {
      console.warn("⚠️ There aren't any audio to load!");
    };

    const assetsNumber = imgsToLoad.length + audiosToLoad.length;

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
    /*
    audioAssets.forEach(src => {
      const audio = new Audio(src);
      audio.addEventListener("canplaythrough", () => {
        setLoadingCounter(prev => prev - 1);
      }, { once: true });
      audio.load(); // força carregar
    });
    */
  };

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

  return { loading, loadAssets };
}