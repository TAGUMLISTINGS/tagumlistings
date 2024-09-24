"use client"

// action
import { deleteAppointment } from "@/app/(admin)/_actions/appointment/delete"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// utils
import { clientErrorHandler } from "@/lib/utils"

// types
import type { Appointments } from "@/app/(admin)/_components/data/appointments"
import type { QueryFilters } from "@tanstack/react-query"

export const useDeleteAppointment = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["delete-appointment"],
    mutationFn: async (id: string) => await deleteAppointment(id),
    onSuccess: async (deletedId: string) => {
      const queryFilter: QueryFilters = {
        queryKey: ["appointments"],
      }

      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<Appointments>(["appointments"], (oldData) => {
        if (!oldData) return undefined

        return {
          ...oldData,
          appointments: oldData.appointments.filter(
            (appointment) => appointment.id !== deletedId,
          ),
        }
      })
    },
    onSettled: async () => {
      router.push("/admin/appointments")
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
