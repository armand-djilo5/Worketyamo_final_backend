import HttpCode from '../core/constants/index.js';
import prisma from '../lib/prisma.js'


export const statControllers = {
    getGlobalStats: async (req, res) => {
        try {
            const [total, byStatus, byType, activeOffers, topOfferGroup] = await Promise.all([
                prisma.request.count(),
                prisma.request.groupBy({ by: ["status"], _count: { _all: true } }),
                prisma.request.groupBy({ by: ["type"], _count: { _all: true } }),
                prisma.offer.count({ where: { isActive: true } }),
                prisma.request.groupBy({
                    by: ["offerId"],
                    _count: { _all: true },
                    orderBy: { _count: { offerId: "desc" } },
                    take: 1,
                })
            ])

            const accepted = byStatus.find((s) => s.status === "ACCEPTEE")?._count._all || 0;
            const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0

            let topOffer = null
            if (topOfferGroup.length > 0) {
                const offer = await prisma.offer.findUnique({
                    where: { id: topOfferGroup[0].offerId },
                    select: { title: true }
                })
                if (offer) topOffer = { title: offer.title, count: topOfferGroup[0]._count._all }
            }
            return res.status(HttpCode.OK).json({ total, byStatus, byType, activeOffers, acceptanceRate, topOffer })
        } catch (error) {
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: "SERVER ERROR" })

        }
    },

    getRequestHistory: async (req, res)=> {
        try {
            const result = await prisma.$runCommandRaw({
                aggregate: "request",
                pipeline: [
                    {
                        $group: {
                            _id: { year: {$year: "$createdAt"}, month: { $month: "$createdAt"}},
                            count: { $sum: 1},
                        }
                    },
                    { $sort: {"_id.year": 1, "_id.month": 1}}

                ],
                cursor: {}
            })

            const history = result.cursor.firstBatch.map((entry)=> ({
                year: entry._id.year,
                month: entry._id.month,
                count: entry.count
            }))
            return res.status(HttpCode.OK).json(history)
        } catch (error) {
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({message: "SERVER ERROR"})
        }
    }
}    