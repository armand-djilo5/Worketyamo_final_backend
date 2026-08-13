import prisma from "../lib/prisma";
import { v4 as uuid } from 'uuid'
import HttpCode from "../core/constants";
import { jwt } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { loginSchema, registerSchema } from "../validators/admin.validators.js";
import { ZodError } from "zod";

const generateAccessToken = (admin) => {
    return jwt.sign({
        id: admin.id,
        role: admin.role
    },
        process.env.JWT_ACCESS_TOKEN,
        { expiresIn: '45m' }
    )
}

const generateRefreshToken = (admin) => {
    return jwt.sign({
        id: admin.id,
        role: admin.role
    },
        process.env.JWT_REFRESH_TOKEN,
        { expiresIn: '7d' }
    )
}


export const adminControllers = {
    signup: async (req, res) => {
        try {
            const data = registerSchema.parse(req.body)
            const { email, password, fullName, role, phone } = req.body

            if (!email || !password || !fullName || !phone) {
                return res.status(HttpCode.BAD_REQUEST).json({ message: "Fill all the information recquired" })
            }

            const emailExist = await prisma.admin.findUnique({
                where: { email }
            })
            if (!emailExist) {
                return res.status(HttpCode.NOT_FOUND).json({ message: "Email not found" })
            }

            const hashPassword = await bcrypt.hash(password, 10)
            const admin = await prisma.admin.create({
                data: {
                    id: uuidv4(),
                    email,
                    password,
                    fullName,
                    phone,
                    role: role || "ADMIN"
                }
            })

            return res.status(HttpCode.CREATED).json({
                message: "Admin created successfully",
                admin: {
                    id: admin.id,
                    email: admin.email,
                    fullName: admin.fullName,
                    role: admin.role,
                    phone: admin.phone
                }
            })
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(HttpCode.BAD_REQUEST).json({ message: error.errors })
            }
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: "SERVER ERROR" })

        }

    },

    login: async (req, res) => {
        try {
            const data = registerSchema.parse(req.body)
            const { email, password } = req.body

            if (!email || !password) {
                res.status(HttpCode.BAD_REQUEST).json({ message: "Email or password" })
            }

            const admin = await prisma.admin.findUnique({
                where: { email }
            })
            if (!admin) {
                return res.status(HttpCode.NOT_FOUND).json({ message: "Admin not found" })
            }

            const verifyPassword = await bcrypt.compare(password, admin.password)
            if (!verifyPassword) {
                return res.status(HttpCode.NOT_FOUND).json({ message: "Invalid password" })
            }

            const accessToken = generateAccessToken(admin)
            const refreshToken = generateRefreshToken(admin)

            await prisma.admin.update({
                where: { id: admin.id },
                data: { refreshToken }
            })
            return res.status(HttpCode.OK).json({
                message: 'Connection succeeded',
                token: accessToken,
                refreshToken: refreshToken,
                admin: { id: admin.id, email: admin.email, role: admin.role, phone: admin.phone }
            })
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(HttpCode.BAD_REQUEST).json({ message: "error.errors" })
            }
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({message: "SERVER ERROR"})
        }

    },

    logout: async (req, res) => {
        try {
            const { refreshToken } = req.body
            const admin = await prisma.admin.findFirst({
                where: { refreshToken }
            })

            if (!admin) {
                return res.status(HttpCode.NOT_FOUND).json({ message: "Admin not found" })
            }

            await prisma.admin.update({
                where: { id: admin.id },
                data: { refreshToken: null }
            })
            return res.status(HttpCode.OK).json({ message: "Logout successfully" })
        } catch (error) {
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({message: "SERVER ERROR"})
        }
    },

    refreshToken: async( req , res )=>{
        try {
            const { refreshToken }= req.body
            if(!refreshToken){
                return res.status(HttpCode.BAD_REQUEST).json({message: "Enter your refresh token"})
            }

            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN)
            const admin = await prisma.findUnique({
                where: { id: decoded.id }
            })

            if(!admin || admin.refreshToken !== refreshToken){
                return res.status(HttpCode.UNAUTHORIZED).json({message: "Refresh token invalid or expired"})
            }

            const newAccessToken = generateAccessToken(admin)

            return res.status(HttpCode.OK).json({ accessToken: newAccessToken})
        } catch (error) {
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({message: "SERVER ERROR"})
        }
    }

}