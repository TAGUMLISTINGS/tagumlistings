// config
import { httpRequest } from "@/lib/config/http"

// actions
// import { getSession } from "@/lib/actions/session/get"

// utils
import { queryOptions } from "@tanstack/react-query"

// types
import type { Accounts } from "@/lib/types"

export async function getAccounts(): Promise<Accounts> {
  const URL = "auth/get-all"
  const response = await httpRequest<void, Accounts>(URL, "GET")

  // const session = await getSession()

  // if (session?.id && response.accounts) {
  //   response.accounts = response.accounts.filter(
  //     (account) => account.id !== session.id,
  //   )
  // }

  return response
}

export async function preFetchAccounts() {
  return queryOptions<Accounts, Error>({
    queryKey: [ "accounts" ],
    queryFn: () => getAccounts(),
  })
}
