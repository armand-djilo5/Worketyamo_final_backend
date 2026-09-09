import express from "express";
import rateLimit from "express-rate-limit";
import { admin_router } from "./routes/admin.routes.js";
import { offer_router } from "./routes/offers.routes.js";
import { request_router } from "./routes/requests.routes.js";
import { stats_router } from "./routes/stats.routes.js";
import cors from 'cors'

const app = express()

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000 , // 15mintes
    max: 100,  // limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later "
})


app.use(cors())
app.use(express.json())
app.use(limiter)
app.use('/api/admin', admin_router)
app.use('/api', offer_router )
app.use('/api', request_router)
app.use('/api', stats_router)









export default app