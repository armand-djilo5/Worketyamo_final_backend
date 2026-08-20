import { z } from 'zod'
import { CMR_PHONE_NUM } from '../utils/phone.utils.js'


export const createRequestSchema = z.object({
    offerId: z.string().uuid("Invalide offer"),
    fullName: z.string().min(3, "Name is compulsory"),
    email: z.string().email("Invalid email"),
    phone: z
        .string()
        .regex(CMR_PHONE_NUM, "The number should be a valid cameroonian number (ex: 6XXXXXXXX)"),
    message: z.string()
})

export const updateRequestStatusSchema = z.object({
    status: z.enum(["EN_ATTENTE", "ACCEPTEE", "REFUSEE"], {
        errorMap: () => ({ message: "Invalid status" })
    }

    )
})