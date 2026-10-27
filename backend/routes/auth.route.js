import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { authCheak } from '../controller/authcontroller.js'


const routes =  express.Router()

routes.get("/cheak",protectRoute,authCheak)

export default routes