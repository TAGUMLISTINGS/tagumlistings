"use client"

// components
import FallbackBoundary from "@/components/shared/fallback-boundary"
import { columns } from "@/components/admin/properties/columns"
import { Separator } from "@/components/ui/separator"
import DataTable from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"

// hooks
import { useDeleteProperties } from "@/lib/hooks/property/bulk-delete"
import { useFetchScroll } from "@/lib/hooks/utils/use-fetch-scroll"
import { useGetProperties } from "@/lib/hooks/property/get-all"
import { useRef } from "react"

// utils
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"

// types
import type { Row } from "@tanstack/react-table"
import type { Property } from "@/lib/types"
import type { ElementRef } from "react"

const PropertiesClient = () => {
  const topRef = useRef<ElementRef<"div">>(null)
  const bottomRef = useRef<ElementRef<"div">>(null)
  const { data } = useGetProperties()
  const deleteProperties = useDeleteProperties()

  useFetchScroll({
    topRef,
    bottomRef,
  })

  const handleDelete = async (rows: Row<Property>[]) => {
    const ids = rows.map((r) => r.original.id)
    await toast.promise(deleteProperties.mutateAsync({ ids }), {
      loading: <span className="animate-pulse">Deleting properties...</span>,
      success: "Properties deleted",
      error: (error: unknown) => clientErrorHandler(error),
    })
  }

  const propertyCount = data?.properties?.length || 0
  const propertiesData = data?.properties ?? []

  return (
    <FallbackBoundary>
      <div className="flex items-start justify-between">
        <Heading
          title={`Properties (${propertyCount})`}
          description="Manage properties"
        />
      </div>
      <Separator className="mt-2" />

      <div ref={topRef}>
        <DataTable
          placeholder="Search.."
          columns={columns}
          isOnProperties
          data={propertiesData}
          onDelete={handleDelete}
        />
      </div>
      <div ref={bottomRef} />
    </FallbackBoundary>
  )
}

export default PropertiesClient