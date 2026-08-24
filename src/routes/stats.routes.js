import { Router } from "express";
import adminMiddleware from "../middleware/admin.middleware.js";
import { statControllers } from "../controllers/stats.controllers.js";

export const stats_router = Router()

const routes = {
    GET_GLOBAL_STATS: '/stats',
    GET_REQUESTS_HISTORY: '/history'
}

stats_router.get(routes.GET_GLOBAL_STATS, adminMiddleware, statControllers.getGlobalStats)
stats_router.get(routes.GET_REQUESTS_HISTORY, adminMiddleware, statControllers.getRequestHistory)