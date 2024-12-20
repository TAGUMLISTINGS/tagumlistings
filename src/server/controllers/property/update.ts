// utils
import { rateLimit, handleErrorResponse } from "@/server/helpers"
import {
  doc,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore"
import {
  checkRequiredFields,
  requestBodyHandler,
  convertTimestampToDateString,
} from "@/lib/utils"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

// types
import type { UpdatePropertyValues } from "@/lib/validation"
import type { NextRequest } from "next/server"
import type { Property } from "@/lib/types"

export async function updatePropertyController(request: NextRequest) {
  try {
    const rateLimitCheck = await rateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const updatePropertyBody =
      await requestBodyHandler<UpdatePropertyValues>(request)

    const {
      id,
      category,
      location,
      status,
      propertyPics,
      price,
      no_of_bedrooms,
      no_of_bathrooms,
      square_meter,
      user,
      appointment_id,
      agent,
    } = updatePropertyBody

    const requiredFields: (keyof typeof updatePropertyBody)[] = ["id"]

    const errorResponse = checkRequiredFields(
      updatePropertyBody,
      requiredFields,
    )

    if (errorResponse) return errorResponse

    if (location) {
      // Check if location is being changed
      const currentProperty = await getDoc(doc(firestore, "properties", id!))
      const currentData = currentProperty.data()

      if (currentData?.location !== location) {
        // Check for duplicate location
        const locationQuery = query(
          collection(firestore, "properties"),
          where("location", "==", location),
        )

        const existingProperties = await getDocs(locationQuery)

        if (!existingProperties.empty) {
          return NextResponse.json(
            { error: "A property with this location already exists" },
            { status: 409 },
          )
        }
      }
    }

    const propertyRef = doc(firestore, "properties", id!)

    // Filter out undefined fields
    const updateData: Partial<Property> = {
      category,
      location,
      status,
      propertyPics,
      price,
      no_of_bedrooms,
      no_of_bathrooms,
      square_meter,
      user,
      appointment_id,
      agent,
      updated_at: serverTimestamp(),
    }

    for (const key of Object.keys(updateData)) {
      if (updateData[key as keyof Property] === undefined) {
        delete updateData[key as keyof Property]
      }
    }

    await updateDoc(propertyRef, updateData)

    const updatedPropertySnapshot = await getDoc(propertyRef)
    const updatedProperty = updatedPropertySnapshot.data() as Property
    const property = {
      ...updatedProperty,
      created_at:
        updatedProperty?.created_at &&
        typeof updatedProperty.created_at === "object"
          ? convertTimestampToDateString(updatedProperty.created_at)
          : null,
      updated_at:
        updatedProperty?.updated_at &&
        typeof updatedProperty.updated_at === "object"
          ? convertTimestampToDateString(updatedProperty.updated_at)
          : null,
    }

    return NextResponse.json(property, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
