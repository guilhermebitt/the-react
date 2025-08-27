// Dependencies
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";


function useAnimation(entity) {
  const [game] = useLocalStorage('game');

  useEffect(() => {

  }, [game.gameTick]);

};

export default useAnimation