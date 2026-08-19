import { Router } from "express";
import { offersControllers } from "../controllers/offer.controllers.js";
import adminMiddleware from "../middleware/admin.middleware.js";

export const offer_router = Router()

const routes = {
    CREATE_OFFER: '/offers',
    GET_OFFER: '/offers',
    GET_OFFER_BY_ID: '/offers/:id',
    GET_OFFER_BY_ADMIN: '/admin/offers',
    UPDATE_OFFER: '/offers/:id',
    DELETE_OFFER: '/offers/:id'
}

offer_router.post(routes.CREATE_OFFER, adminMiddleware, offersControllers.createOffers)
offer_router.get(routes.GET_OFFER, offersControllers.getOffers)
offer_router.get(routes.GET_OFFER_BY_ID, adminMiddleware, offersControllers.getOffersById)
offer_router.get(routes.GET_OFFER_BY_ADMIN, adminMiddleware, offersControllers.getOffersByAdmin)
offer_router.put(routes.UPDATE_OFFER, adminMiddleware, offersControllers.updateOffer)
offer_router.delete(routes.DELETE_OFFER, adminMiddleware, offersControllers.deleteOffer)