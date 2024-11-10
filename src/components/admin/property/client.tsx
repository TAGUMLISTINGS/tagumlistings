"use client"

// components
import FallbackBoundary from "@/components/shared/fallback-boundary"
import UpdatePropertyForm from "@/components/admin/property/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

// hooks
import { useGetProperty } from "@/lib/hooks/property/get"
import { useGetAccounts } from "@/lib/hooks/auth/get-all"

const PropertyClient = ({ id }: { id?: string }) => {
  const { data } = useGetProperty(id!)
  const { data: accounts } = useGetAccounts()

  return (
    <FallbackBoundary>
      <div className="flex items-start justify-between">
        <Heading title="Property" description="Manage property information" />
      </div>
      <Separator className="mt-2" />

      <div className="container flex flex-col justify-center items-center lg:w-[400px] sm:w-[300px] h-auto p-5 mt-5">
        <UpdatePropertyForm data={data} accounts={accounts} />
      </div>
    </FallbackBoundary>
  )
}

export default PropertyClient
