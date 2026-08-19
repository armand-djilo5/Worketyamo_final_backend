import {z} from 'zod';

export const createOfferSchema = z.object({
    type: z.enum(["STAGE", "FORMATION"], { errorMap: () =>({ message: "Invalid type"})}),
    title: z.string().min(3, "The title must contain atleast 3 letter characters"),
    domaine: z.string().min(2, "The domaine is needed" ),
    description: z.string().min(10 , "The description must contain atleast 10 letter characters"),
    duration: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional()
})

export const updateOfferSchema = createOfferSchema.partial()