import { Router } from 'express'
import { requestControllers } from '../controllers/requests.controllers.js'
import adminMiddleware from '../middleware/admin.middleware.js'

export const request_router = Router()

const routes = {
    CREATE_REQUEST: '/requests',
    GET_REQUEST: '/requests',
    GET_REQUEST_BY_ID: '/requests/:id',
    UPDATE_REQUEST: '/requests/:id',
    DELETE_REQUEST: '/requests/:id'
}

request_router.post(routes.CREATE_REQUEST, requestControllers.createRequest)
request_router.get(routes.GET_REQUEST, adminMiddleware, requestControllers.getRequest)
request_router.get(routes.GET_REQUEST_BY_ID, adminMiddleware, requestControllers.getRequestById)
request_router.put(routes.UPDATE_REQUEST, adminMiddleware, requestControllers.updateRequest)
request_router.delete(routes.DELETE_REQUEST, adminMiddleware, requestControllers.deleteRequest)