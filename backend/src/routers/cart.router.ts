import express from 'express'
import CartController from '~/controllers/cart.controller'
import { isAuthenticated } from '~/middlewares/auth.middleware'
import { CatchAsyncError } from '~/middlewares/catch-async-errors.middleware'

const router = express.Router()

router.get('/', isAuthenticated, CatchAsyncError(CartController.getCartByUser))
router.post('/', isAuthenticated, CatchAsyncError(CartController.addItemToCart))
router.delete('/:id', isAuthenticated, CatchAsyncError(CartController.removeItemFromCart))
export default router
