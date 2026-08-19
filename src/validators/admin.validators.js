import { z } from 'zod'


export const registerSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalide email address"),
    password: z.string().min(8, "Password must be atleast 8 characters"),
    role: z.enum(["ADMIN"]).default("ADMIN"),
    phone: z.string(),
})

export const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Le mot de passe est requis"),
})