import { v4 as uuidv4 } from "uuid";
import  HttpCode  from "../core/constants/index.js";
import prisma from "../lib/prisma.js";
import { createOfferSchema, updateOfferSchema } from "../validators/offers.validators.js";
import { ZodError } from "zod"

export const offersControllers = {
    getOffers: async (req, res) => {
        try {
            const { domaine } = req.query

            const where = {
                isActive: true,
                type: { in: ["STAGE", "FORMATION"] }
            }
            if (domaine) where.domaine = { contains: domaine, mode: "insensitive" }

            const offers = await prisma.offer.findMany({
                where,
                orderBy: { createdAt: "desc" }
            })

            if (offers.length === 0) {
                return res.status(HttpCode.NOT_FOUND).json({ message: "No offer found" })
            }

            return res.status(HttpCode.OK).json(offers)
        } catch (error) {
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: "SERVER ERROR" })

        }
    },

    getOffersById: async (req, res) => {
        try {
            const { id } = req.params

            const offer = await prisma.offer.findUnique({
                where: { id }
            })

            if (!offer || !offer.isActive) {
                return res.status(HttpCode.NOT_FOUND).json({ message: "This offer is not found" })
            }
            return res.status(HttpCode.OK).json(offer)
        } catch (error) {
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: "SERVER ERROR" })
        }
    },

    getOffersByAdmin: async (req, res) => {
        try {
            const offers = await prisma.offer.findMany({
                orderBy: { createdAt: "desc" },
                include: { _count: { select: { requests: true } } }
            })
            if (offers.length === 0) {
                return res.status(HttpCode.NOT_FOUND).json({ message: "Offers not found" })
            }

            return res.status(HttpCode.OK).json(offers)
        } catch (error) {
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: "SERVER ERROR" })
        }
    },

    createOffers: async (req, res) => {
        try {
            const data = createOfferSchema.parse(req.body)

            const { type, title, domaine, description, duration, startDate, endDate, isActive } = data
            if (!type || !title || !domaine || !description) {
                return res.status(HttpCode.BAD_REQUEST).json({ message: "Fill all the criterias" })
            }

            const offer = await prisma.offer.create({
                data: {
                    id: uuidv4(),
                    type,
                    title,
                    domaine,
                    description,
                    duration,
                    startDate,
                    endDate,
                    isActive
                }
            })

            return res.status(HttpCode.CREATED).json({ message: "Offer created", offer })
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(HttpCode.BAD_REQUEST).json({ message: error.errors })
            }
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: "SERVER ERROR" })

        }
    },

    updateOffer: async (req, res) => {
        try {
            const { id } = req.params
            const data = updateOfferSchema.parse(req.body)

            const existe = await prisma.offer.findUnique({
                where: { id }
            })
            if (!existe) {
                return res.status(HttpCode.NOT_FOUND).json({ message: "Offer not found" })
            }

            const offer = await prisma.offer.update({
                where: { id },
                data,
            })
            return res.status(HttpCode.OK).json({ message: "Offer updated successfully", offer })
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(HttpCode.BAD_REQUEST).json({ message: error.errors })
            }
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: "SERVER ERROR" })
        }
    },

    deleteOffer: async (req, res) => {
        try {
            const { id } = req.params

            const existe = await prisma.offer.findUnique({
                where: { id }
            })
            if (!existe) {
                return res.status(HttpCode.NOT_FOUND).json({ message: "Offer not found" })
            }

            await prisma.offer.delete({
                where: { id }
            })
            return res.status(HttpCode.OK).json({ message: "Offer deleted successfully" })
        } catch (error) {
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({message: "SERVER ERROR "})
        }
    }
}