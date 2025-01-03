"use client"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "@/components/providers/session"
import { useRouter } from "next-nprogress-bar"

// actions
import { updatePayment } from "@/lib/actions/payment/update"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import { updatePaymentSchema } from "@/lib/validation"
import DOMPurify from "dompurify"

// types
import type { UpdatePaymentValues } from "@/lib/validation"
import type { QueryFilters } from "@tanstack/react-query"
import type { Payment, Payments } from "@/lib/types"

const purify = DOMPurify

export const useUpdatePayment = (id?: string) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const session = useSession()

  return useMutation({
    mutationKey: ["update-payment", id],
    mutationFn: async (values: UpdatePaymentValues) => {
      const sanitizedData = sanitizer<UpdatePaymentValues>(
        values,
        updatePaymentSchema,
        purify,
      )
      return await updatePayment(sanitizedData)
    },
    onSuccess: async (updatedPayment) => {
      const paymentQueryFilter: QueryFilters = {
        queryKey: ["payment", id],
      }

      const paymentsQueryFilter: QueryFilters = {
        queryKey: ["payments"],
      }

      await queryClient.cancelQueries(paymentsQueryFilter)
      await queryClient.cancelQueries(paymentQueryFilter)

      queryClient.setQueryData<Payment>(["payment", id], (oldData) => ({
        ...oldData,
        ...updatedPayment,
      }))

      queryClient.setQueryData<Payments>(["payments"], (oldData) => {
        if (!oldData) return { payments: [updatedPayment] }
        return {
          ...oldData,
          payments: oldData.payments.map((payment) =>
            payment.id === id ? updatedPayment : payment,
          ),
        }
      })
    },
    onSettled: () => {
      if (session.role === "admin") {
        router.push("/admin/records")
        router.refresh()
        return
      }
      if (session.role === "agent") {
        router.push("/agent/records")
        router.refresh()
        return
      }
      if (session.role === "client") {
        router.push("/records")
        router.refresh()
        return
      }
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
