import { handleFailed, handleSucceed, path } from "..";
import type { Account } from "../type";

type Props = {
  playerId: number;
  revalidate?: number;
};

export async function getSmashmateAccount({
  playerId,
  revalidate,
}: Props): Promise<Account> {
  console.log(path(`/api/accounts/${playerId}`));
  return fetch(path(`/api/accounts/${playerId}`), {
    next: {
      ...(revalidate !== undefined && { revalidate }),
    },
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
