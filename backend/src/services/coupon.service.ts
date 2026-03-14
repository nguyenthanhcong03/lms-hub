import { FilterQuery } from 'mongoose'
import { CouponStatus } from '~/constants/enums'
import { BadRequestError } from '~/core/error.response'
import CouponModel from '~/models/coupon.model'
import { CouponQueryParams, CreateCouponParams } from '~/types/coupon.type'

const CouponService = {
  createCoupon: async (couponData: CreateCouponParams) => {
    const findCoupon = await CouponModel.findOne({ code: couponData.code })

    if (findCoupon) {
      throw new BadRequestError('Mã giảm giá đã tồn tại')
    }

    const newCoupon = await CouponModel.create(couponData)
    return newCoupon
  },

  applyCoupon: async (couponData: { code: string; courseId: string }) => {
    const { code, courseId } = couponData

    const coupon = await CouponModel.findOne({ code })

    const couponCourses = coupon?.courses.map((course) => course.toString()) || []

    let isActive = true

    if (!couponCourses.includes(courseId)) isActive = false

    if (coupon?.status === CouponStatus.INACTIVE) isActive = false

    if ((coupon?.used ?? 0) >= (coupon?.max_uses ?? 0)) isActive = false

    if (coupon?.start_date && new Date(coupon?.start_date) > new Date()) isActive = false
    if (coupon?.end_date && new Date(coupon?.end_date) < new Date()) isActive = false

    if (!isActive) {
      throw new BadRequestError('Mã giảm giá không hợp lệ hoặc đã hết hạn')
    }

    return coupon
  },

  getCoupon: async (couponId: string) => {
    const coupon = await CouponModel.findById(couponId).populate('courses', 'title')

    return coupon
  },

  updateCoupon: async (couponId: string, updateData: Partial<CreateCouponParams>) => {
    const result = await CouponModel.findByIdAndUpdate(couponId, updateData, { new: true })

    return result
  },

  getAllCoupons: async (queryParams: CouponQueryParams) => {
    const limit = +(queryParams?.limit ?? 10)
    const search = queryParams?.search || ''
    const page = +(queryParams?.page ?? 1)
    const status = queryParams?.status || ''
    const skip = (page - 1) * limit

    const query: FilterQuery<typeof CouponModel> = {}

    if (search) {
      query.$or = [{ title: { $regex: search, $options: 'i' } }, { code: { $regex: search, $options: 'i' } }]
    }

    if (status) {
      query.status = status
    }

    const [total_count, coupons] = await Promise.all([
      CouponModel.countDocuments(query),
      CouponModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).populate('courses', 'title')
    ])

    const total_pages = Math.ceil(total_count / limit)

    return { coupons, pagination: { page, per_page: limit, total_pages, total_count } }
  },

  deleteCoupon: async (couponId: string) => {
    const result = await CouponModel.findByIdAndDelete(couponId)

    if (!result) {
      throw new BadRequestError('Mã giảm giá không tồn tại')
    }

    return result
  },

  deleteMultipleCoupons: async (couponIds: string[]) => {
    const result = await CouponModel.deleteMany({ _id: { $in: couponIds } })

    if (result.deletedCount === 0) {
      throw new BadRequestError('Không có mã giảm giá nào được tìm thấy')
    }
    return result
  }
}

export default CouponService
