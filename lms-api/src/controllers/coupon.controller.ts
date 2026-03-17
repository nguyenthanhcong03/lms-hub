import { Request, Response } from 'express'
import { CouponService } from '../services/coupon.service'
import { sendSuccess } from '../utils/success'
import { CreateCouponInput, UpdateCouponInput, GetCouponsQuery, ApplyCouponInput } from '../schemas/coupon.schema'

/**
 * Coupon Controller
 * Simple CRUD operations for coupons
 */

export class CouponController {
  /**
   * Create new coupon
   */
  static async createCoupon(req: Request, res: Response): Promise<void> {
    const couponData: CreateCouponInput = req.body
    const coupon = await CouponService.createCoupon(couponData)

    sendSuccess.created(res, 'Coupon được tạo thành công', { coupon })
  }

  /**
   * Get all coupons with pagination and filtering
   */
  static async getCoupons(req: Request, res: Response): Promise<void> {
    const query: Partial<GetCouponsQuery> = req.query
    const result = await CouponService.getCoupons(query)

    sendSuccess.ok(res, 'Coupons được tải thành công', result)
  }

  /**
   * Get active coupons only
   */
  static async getActiveCoupons(req: Request, res: Response): Promise<void> {
    const coupons = await CouponService.getActiveCoupons()

    sendSuccess.ok(res, 'Active coupons được tải thành công', { coupons })
  }

  /**
   * Get coupon by ID
   */
  static async getCouponById(req: Request, res: Response): Promise<void> {
    const { couponId } = req.params
    const coupon = await CouponService.getCouponById(couponId)

    sendSuccess.ok(res, 'Coupon được tải thành công', { coupon })
  }

  /**
   * Update coupon
   */
  static async updateCoupon(req: Request, res: Response): Promise<void> {
    const { couponId } = req.params
    const updateData: UpdateCouponInput = req.body
    const coupon = await CouponService.updateCoupon(couponId, updateData)

    sendSuccess.ok(res, 'Coupon được cập nhật thành công', { coupon })
  }

  /**
   * Delete coupon
   */
  static async deleteCoupon(req: Request, res: Response): Promise<void> {
    const { couponId } = req.params
    await CouponService.deleteCoupon(couponId)

    sendSuccess.ok(res, 'Coupon được xóa thành công')
  }

  /**
   * Validate coupon code
   */
  static async validateCoupon(req: Request, res: Response): Promise<void> {
    const validationData: ApplyCouponInput = req.body
    const result = await CouponService.validateCoupon(validationData)

    sendSuccess.ok(res, 'Coupon is valid', result)
  }

  /**
   * Apply coupon (for checkout process)
   */
  static async applyCoupon(req: Request, res: Response): Promise<void> {
    const { couponId } = req.params
    const coupon = await CouponService.applyCoupon(couponId)

    sendSuccess.ok(res, 'Coupon được áp dụng thành công', { coupon })
  }
}
