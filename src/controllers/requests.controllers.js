import { v4 as uuidv4 } from 'uuid'
import HttpCode from '../core/constants/index.js'
import prisma from '../lib/prisma.js'
import { createRequestSchema, updateRequestStatusSchema } from '../validators/requests.validators.js'
import { normalizeCmrPhone } from '../utils/phone.utils.js'
import { buildWhatsappLink } from '../utils/whatsappLink.utils.js'
import { ZodError } from 'zod'
import { notifyAdminNewRequest } from '../services/email.services.js'



export const requestControllers = {
    createRequest: async (req, res) => {
        try {
            const data = createRequestSchema.parse(req.body)

            const { offerId, fullName, email, phone, message } = data
            if (!offerId || !fullName || !email || !phone || !message) {
                return res.status(HttpCode.BAD_REQUEST).json({ message: "Fill all the criterias" })
            }

            const offer = await prisma.offer.findUnique({
                where: { id: offerId }
            })
            if (!offer || !offer.isActive) {
                return res.status(HttpCode.NOT_FOUND).json({ message: "Offer not found" })
            }

            const request = await prisma.request.create({
                data: {
                    id: uuidv4(),
                    offerId,
                    type: offer.type,
                    fullName,
                    email,
                    phone: normalizeCmrPhone(phone),
                    message,
                    cvUrl: req.file ? req.file.path : null,
                },
                include: { offer: true }
            })

            notifyAdminNewRequest(request)

            return res.status(HttpCode.CREATED).json({
                message: "Votre candidature a bien ete envoyer. Nous reviendrons vers vous rapidement. "
            })
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(HttpCode.BAD_REQUEST).json({ message: error.errors })
            }
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: "SERVER ERROR" })

        }
    },

    getRequest: async (req, res) => {
        try {
            const { status, type, offerId, from, to, page = 1, limit = 20 } = req.query

            const where = {}
            if (status) where.status = status;
            if (type) where.type = type;
            if (offerId) where.offerId = offerId;
            if (from || to) {
                where.createdAt = {};
                if (from) where.createdAt.gte = new Date(from);
                if (to) where.createdAt.lte = new Date(to);
            }

            const take = Math.min(Number(limit) || 20, 100)
            const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

            const [requests, total] = await Promise.all([
                prisma.request.findMany({
                    where,
                    include: { offer: { select: { title: true, type: true } } },
                    orderBy: { createdAt: "desc" },
                    skip,
                    take
                }),
                prisma.request.count({ where })
            ])
            return res.status(HttpCode.OK).json({
                data: requests,
                pagination: { total, page: Number(page), limit: take, totalPages: Math.ceil(total / take) }

            })
        } catch (error) {
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: "SERVER ERROR" })
        }
    },

    getRequestById: async (req, res) => {
        try {
            const { id } = req.params

            const request = await prisma.request.findUnique({
                where: { id },
                include: { offer: true }
            })

            if (!request) {
                return res.status(HttpCode.NOT_FOUND).json({ message: "Request not found" })
            }
            return res.status(HttpCode.OK).json({ ...request, whatsappLink: buildWhatsappLink(request) })
        } catch (error) {
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: "SERVER ERROR" })
        }
    },

    updateRequest: async (req, res) => {
        try {
            const { id } = req.params

            const data = updateRequestStatusSchema.parse(req.body)

            const existe = await prisma.request.findUnique({
                where: { id }
            })
            if(!existe){
                return res.status(HttpCode.NOT_FOUND).json({message: "Request not found"})
            }

            const request = await prisma.request.update({
                where: { id },
                data: {
                    status: data.status,
                    treatedAt: data.status === "EN_ATTENTE" ? null : new Date()
                },
                include: { offer: true}
            })
            return res.status(HttpCode.OK).json({...request, whatsappLink: buildWhatsappLink(request)})
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(HttpCode.BAD_REQUEST).json({ message: error.errors })
            }
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: "SERVER ERROR" })

        }

    },

    deleteRequest: async ( req, res )=>{
        try {
            const { id }= req.params

            const request = await prisma.request.findUnique({
                where: { id }
            })
            if(!request){
                return res.status(HttpCode.NOT_FOUND).json({message: "Request not found"})
            }
            await prisma.request.delete({
                where: { id }
            })
            return res.status(HttpCode.OK).json({message: "deleted successfully"})


        } catch (error) {
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({message: "SERVER ERROR"})
        }
    }


}