import { Router } from "express";
import { adminControllers } from "../controllers/admin.controllers.js";


export const admin_router = Router()

const routes = {
    SIGNUP: '/signup',
    LOGIN: '/login',
    LOGOUT: '/logout',
    REFRESH: '/refresh'
}

admin_router.post(routes.SIGNUP,  adminControllers.signup)
admin_router.post(routes.LOGIN, adminControllers.login)
admin_router.post(routes.LOGOUT, adminControllers.logout)
admin_router.post(routes.REFRESH, adminControllers.refreshToken)