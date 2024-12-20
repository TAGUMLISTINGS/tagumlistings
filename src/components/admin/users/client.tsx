"use client"

// components
import FallbackBoundary from "@/components/shared/fallback-boundary"
import { columns } from "@/components/admin/users/columns"
import { Separator } from "@/components/ui/separator"
import DataTable from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"

// hooks
import { useFetchScroll } from "@/lib/hooks/utils/use-fetch-scroll"
import { useDeleteAccounts } from "@/lib/hooks/auth/bulk-delete"
import { useGetAccounts } from "@/lib/hooks/auth/get-all"
import { useRef } from "react"

// utils
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"

// types
import type { Row } from "@tanstack/react-table"
import type { UserData } from "@/lib/types"

const UsersClient = () => {
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { data } = useGetAccounts()
  const deleteAccounts = useDeleteAccounts()

  useFetchScroll({
    topRef,
    bottomRef,
  })

  const handleDelete = async (rows: Row<UserData>[]) => {
    const ids = rows.map((r) => r.original.id)

    await toast.promise(deleteAccounts.mutateAsync({ ids }), {
      loading: <span className="animate-pulse">Deleting accounts...</span>,
      success: "Accounts deleted",
      error: (error: unknown) => clientErrorHandler(error),
    })
  }

  const accountCount = data?.accounts?.length || 0
  const accountsData = data?.accounts ?? []

  return (
    <FallbackBoundary>
      <div className="flex items-start justify-between">
        <Heading title={`Users (${accountCount})`} description="Manage users" />
      </div>
      <Separator className="mt-2" />

      <div ref={topRef}>
        <DataTable
          placeholder="Search.."
          columns={columns}
          isOnUsers
          data={accountsData}
          onDelete={handleDelete}
        />
      </div>
      <div ref={bottomRef} />
    </FallbackBoundary>
  )
}

export default UsersClient
