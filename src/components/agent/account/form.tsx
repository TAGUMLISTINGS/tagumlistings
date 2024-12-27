"use client"

// components
import DynamicForm from "@/components/shared/dynamic-form"

// utils
import { updateAccountFields } from "@/lib/misc/field-configs"
import { updateAccountSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"

// hooks
import { useSession } from "@/components/providers/session"
import { useUpdateAccount } from "@/lib/hooks/auth/update"
import { useForm } from "react-hook-form"

// types
import type { UpdateAccountValues } from "@/lib/validation"
import type { UserData } from "@/lib/types"

interface AccountFormProps {
  id?: string | undefined
  data: UserData
  isOnClient?: boolean
}

const AccountForm = ({ id, data, isOnClient }: AccountFormProps) => {
  const updateAccountMutation = useUpdateAccount(id)
  const session = useSession()

  const form = useForm<UpdateAccountValues>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      id: data.id,
      name: data.name,
      address: data.address,
      contact_number: data.contact_number,
      email: data.email,
      role: data.role,
      password: undefined,
      newpassword: undefined,
    },
  })

  // submit handler
  const onSubmit = async (values: UpdateAccountValues) => {
    await toast.promise(updateAccountMutation.mutateAsync(values), {
      loading: <span className="animate-pulse">Updating account...</span>,
      success: "Account updated",
      error: (error: unknown) => clientErrorHandler(error),
    })
    form.reset(values)
  }

  return (
    <>
      <DynamicForm<UpdateAccountValues>
        form={form}
        onSubmit={onSubmit}
        fields={updateAccountFields(isOnClient, session.role)}
        submitButtonTitle="Update"
        submitButtonClassname="bg-green-500 rounded-3xl"
        submitButtonTitleClassname="text-md font-medium"
        mutation={updateAccountMutation}
      />
    </>
  )
}

export default AccountForm
