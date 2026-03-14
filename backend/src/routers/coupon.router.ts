import express from 'express'
import { UserRole } from '~/constants/enums'
import CouponController from '~/controllers/coupon.controller'
import { isAuthenticated } from '~/middlewares/auth.middleware'
import { CatchAsyncError } from '~/middlewares/catch-async-errors.middleware'
import authorizeRoles from '~/middlewares/rbac.middleware'
import { validateRequestBody } from '~/middlewares/validation.middleware'
import { applyCouponSchema, couponSchema } from '~/schemas/coupon.schema'

const router = express.Router()

router.post(
  '/',
  isAuthenticated,
  validateRequestBody(couponSchema),
  authorizeRoles(UserRole.ADMIN),
  CatchAsyncError(CouponController.createCoupon)
)
router.get('/', isAuthenticated, authorizeRoles(UserRole.ADMIN), CatchAsyncError(CouponController.getAllCoupons))
router.post(
  '/apply',
  isAuthenticated,
  validateRequestBody(applyCouponSchema),
  CatchAsyncError(CouponController.applyCoupon)
)
router.get('/:id', isAuthenticated, CatchAsyncError(CouponController.getCoupon))
router.put('/:id', isAuthenticated, authorizeRoles(UserRole.ADMIN), CatchAsyncError(CouponController.updateCoupon))
router.delete(
  '/delete-many',
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN),
  CatchAsyncError(CouponController.deleteMultipleCoupons)
)
router.delete('/:id', isAuthenticated, authorizeRoles(UserRole.ADMIN), CatchAsyncError(CouponController.deleteCoupon))

export default router
