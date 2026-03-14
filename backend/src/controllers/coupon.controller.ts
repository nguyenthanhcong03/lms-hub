import { Request, Response } from 'express'
import { BadRequestError } from '~/core/error.response'
import { OK } from '~/core/success.response'
import CouponService from '~/services/coupon.service'

const CouponController = {
  createCoupon: async (req: Request, res: Response) => {
    const result = await CouponService.createCoupon(req.body)
    return new OK({
      message: 'Coupon created successfully',
      data: result
    }).send(res)
  },

  applyCoupon: async (req: Request, res: Response) => {
    const result = await CouponService.applyCoupon(req.body)
    return new OK({
      message: 'Coupon applied successfully',
      data: result
    }).send(res)
  },

  getCoupon: async (req: Request, res: Response) => {
    const { id: couponId } = req.params
    const result = await CouponService.getCoupon(couponId)
    return new OK({
      message: 'Coupon retrieved successfully',
      data: result
    }).send(res)
  },

  updateCoupon: async (req: Request, res: Response) => {
    const { id: couponId } = req.params
    const result = await CouponService.updateCoupon(couponId, req.body)
    return new OK({
      message: 'Coupon updated successfully',
      data: result
    }).send(res)
  },

  deleteCoupon: async (req: Request, res: Response) => {
    const { id: couponId } = req.params
    const result = await CouponService.deleteCoupon(couponId)
    return new OK({
      message: 'Coupon deleted successfully',
      data: result
    }).send(res)
  },

  deleteMultipleCoupons: async (req: Request, res: Response) => {
    const couponIds = req.body.couponIds

    if (!couponIds || couponIds.length === 0) {
      throw new BadRequestError('Coupon IDs are required')
    }

    const result = await CouponService.deleteMultipleCoupons(couponIds)

    return new OK({
      message: 'Multiple coupons deleted successfully',
      data: result
    }).send(res)
  },

  getAllCoupons: async (req: Request, res: Response) => {
    const queryParams = req.query

    const result = await CouponService.getAllCoupons(queryParams)

    return new OK({
      message: 'All coupons retrieved successfully',
      data: result
    }).send(res)
  }
}

export default CouponController
