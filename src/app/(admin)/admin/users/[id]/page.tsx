// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import ContentLayout from "@/components/layouts/admin/content-layout"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import AccountClient from "@/components/admin/account/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { getSession } from "@/lib/actions/session/get"

// utils
import { accountItems } from "@/lib/misc/breadcrumb-lists"
import { dataSerializer } from "@/lib/utils"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Account",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AccountIdPage({ params }: PageProps) {
  const [sessionData, resolvedParams] = await Promise.all([
    getSession(),
    params,
  ])
  const userData = dataSerializer(sessionData)
  const { id } = resolvedParams
  return (
    <HydrationBoundaryWrapper accountId={userData.id}>
      <ContentLayout title="User">
        <BounceWrapper>
          <DynamicBreadcrumb items={accountItems} />

          <AccountClient id={id} />
        </BounceWrapper>
      </ContentLayout>
    </HydrationBoundaryWrapper>
  )
}
