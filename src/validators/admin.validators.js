import { z } from 'zod'


// export const registerSchema = z.object({
//     fullName: z.string().min(2, "Name must be at least 2 characters"),
//     email: z.string().email("Invalide email address"),
//     password: z.string().min(8, "Password must be atleast 8 characters"),
//     role: z.enum(["ADMIN"]).default("ADMIN"),
//     phone: z.string(),
// })

// export const loginSchema = z.object({
//     email: z.string().email("Email invalide"),
//     password: z.string().min(1, "Le mot de passe est requis"),
// })

// // src/validators/admin.validators.js
// import { z } from 'zod'

export const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be atleast 8 characters"),
    fullName: z.string().min(3, "Name must be at least 2 characters"),
    phone: z.string().min(9, "Invalide phone number"),
    role: z.enum(["ADMIN"]).optional()
})

export const loginSchema = z.object({
    email: z.string().email("Ivalid Email address"),
    password: z.string().min(1, "Password needed")
})