import { staticPath } from "@/app/_lib/services";
import { PlayerRatesJson } from "@/app/_lib/services/type";
import { useEffect, useState } from "react";

export const usePlayerRates = (season: string) => {
  const [playerRates, setPlayerRates] = useState<PlayerRatesJson | undefined>(undefined);

  useEffect(() => {
    if (playerRates) {
      return;
    }
    const fetchData = async () => {
      const path = staticPath(`/player-rates/${season}.json`);
      const response = await fetch(path, {mode: "cors" });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setPlayerRates(jsonData);
    };
    fetchData();
  }, [season, playerRates])
  return playerRates;
};