import express from 'express'
import OrderController from '~/controllers/order.controller'
import { isAuthenticated } from '~/middlewares/auth.middleware'
import { CatchAsyncError } from '~/middlewares/catch-async-errors.middleware'

const router = express.Router()

router.get('/', isAuthenticated, CatchAsyncError(OrderController.fetchAllOrders))
router.get('/me', isAuthenticated, CatchAsyncError(OrderController.fetchUserOrders))
router.post('/', isAuthenticated, CatchAsyncError(OrderController.createNewOrder))
router.put('/:id', isAuthenticated, CatchAsyncError(OrderController.modifyOrderStatus))

export default router
