// utils
import {
  doc,
  addDoc,
  getDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore"
import { rateLimit, handleErrorResponse } from "@/server/helpers"
import { checkRequiredFields, requestBodyHandler } from "@/lib/utils"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

// types
import type { AddPropertyValues } from "@/lib/validation"
import type { NextRequest } from "next/server"
import type { Property } from "@/lib/types"

export async function createPropertyController(request: NextRequest) {
  try {
    const rateLimitCheck = await rateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const createPropertyBody =
      await requestBodyHandler<AddPropertyValues>(request)

    const {
      category,
      location,
      status,
      propertyPics,
      price,
      no_of_bedrooms,
      no_of_bathrooms,
      square_meter,
    } = createPropertyBody

    const requiredFields: (keyof typeof createPropertyBody)[] = [
      "category",
      "location",
      "status",
      "propertyPics",
      "price",
      "no_of_bedrooms",
      "no_of_bathrooms",
      "square_meter",
    ]

    const errorResponse = checkRequiredFields(
      createPropertyBody,
      requiredFields,
    )

    if (errorResponse) return errorResponse

    const propertyData = {
      category,
      location,
      status,
      propertyPics,
      price,
      no_of_bedrooms,
      no_of_bathrooms,
      square_meter,
      user: null,
      appointment_id: null,
      created_at: serverTimestamp(),
    }

    const propertyRef = await addDoc(
      collection(firestore, "properties"),
      propertyData,
    )

    const id = propertyRef.id
    await updateDoc(doc(firestore, "properties", id), {
      ...propertyData,
      id,
      updatedAt: serverTimestamp(),
    })

    const updatedProperty = await getDoc(doc(firestore, "properties", id))
    const property = updatedProperty.data() as Property

    return NextResponse.json(property, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
