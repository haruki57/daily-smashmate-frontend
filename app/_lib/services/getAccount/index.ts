import { handleFailed, handleSucceed, path } from "..";
import type { Account } from "../type";

type Props = {
  playerId: number;
};

export async function getSmashmateAccount({
  playerId,
}: Props): Promise<Account> {
  return fetch(path(`/api/accounts/${playerId}`), {
    next: {
      revalidate: 60 * 60 * 24,
    },
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
