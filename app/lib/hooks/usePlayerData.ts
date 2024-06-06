import { staticPath } from "@/app/_lib/services";
import { PlayerDataJson } from "@/app/_lib/services/type";
import { useEffect, useState } from "react";

export const usePlayerData = () => {
  const [playerData, setPlayerData] = useState<PlayerDataJson | undefined>(undefined);
  useEffect(() => {
    const fetchData = async () => {
      const path = staticPath(`/playerData.json`);
      const response = await fetch(path, {mode: "cors" });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setPlayerData(jsonData);
    };
    if (!playerData) {
      fetchData();
    }
  }, [])
  return playerData;
};