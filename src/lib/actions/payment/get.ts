// configs
import { httpRequest } from "@/lib/config/http"

// utils
import { queryOptions } from "@tanstack/react-query"

// types
import type { QueryClient } from "@tanstack/react-query"
import type { Payment } from "@/lib/types"

export async function getPayment(id: string): Promise<Payment> {
  const URL = "payment/get"
  const response = await httpRequest<{ id: string }, Payment>(URL, "GET", {
    params: {
      id,
    },
  })
  return response
}

export async function preFetchPayment(id: string) {
  return async (_queryClient: QueryClient) => {
    return queryOptions<Payment, Error>({
      enabled: !!id,
      queryKey: ["payment", id],
      queryFn: () => getPayment(id),
    })
  }
}
