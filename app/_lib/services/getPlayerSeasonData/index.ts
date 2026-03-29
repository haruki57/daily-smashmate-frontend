import { handleFailed, handleSucceed, path } from "..";
import type { PlayerDataBySeason } from "../type";

type Props = {
  playerId: number;
};

export async function getPlayerSeasonData({
  playerId,
}: Props): Promise<{ [key in string]?: PlayerDataBySeason }> {
  return fetch(path(`/api/playerDataBySeason/${playerId}`))
    .then(handleSucceed)
    .catch(handleFailed);
}
