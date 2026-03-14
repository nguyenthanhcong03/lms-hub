import { FilterQuery } from 'mongoose'
import { OrderStatus } from '~/constants/enums'
import { BadRequestError } from '~/core/error.response'
import CouponModel from '~/models/coupon.model'
import CourseModel from '~/models/course.model'
import OrderModel from '~/models/order.model'
import UserModel from '~/models/user.model'
import { CreateOrderParams, OrderQueryParams, UpdateOrderParams } from '~/types/order.type'

import CartService from './cart.service'
import { toObjectId } from '~/utils'

const OrderService = {
  fetchAllOrders: async (queryParams: OrderQueryParams) => {
    const limit = +(queryParams?.limit ?? 10)
    const search = queryParams?.search || ''
    const page = +(queryParams?.page ?? 1)
    const status = queryParams?.status
    const skip = (page - 1) * limit

    const query: FilterQuery<typeof OrderModel> = {}

    if (status) {
      query.status = status
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: 'i' } }]
    }

    const [orders, total_count] = await Promise.all([
      OrderModel.find(query)
        .populate({ model: CourseModel, select: 'title', path: 'course' })
        .populate({ path: 'user', model: UserModel, select: 'username email avatar' })
        .populate({ path: 'coupon', select: 'code value' })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      OrderModel.countDocuments(query)
    ])

    const total_pages = Math.ceil(total_count / limit)
    return { orders, pagination: { page, per_page: limit, total_pages, total_count } }
  },

  fetchUserOrders: async (userId: string, queryParams: OrderQueryParams) => {
    const limit = +(queryParams?.limit ?? 10)
    const search = queryParams?.search || ''
    const page = +(queryParams?.page ?? 1)
    const status = queryParams?.status
    const skip = (page - 1) * limit

    const query: FilterQuery<typeof OrderModel> = { user: toObjectId(userId) }

    if (status) {
      query.status = status
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: 'i' } }]
    }

    const [orders, total_count] = await Promise.all([
      OrderModel.find(query)
        .populate({ model: CourseModel, select: 'title', path: 'course' })
        .populate({ path: 'coupon', select: 'code value' })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      OrderModel.countDocuments(query)
    ])

    const total_pages = Math.ceil(total_count / limit)
    return { orders, pagination: { page, per_page: limit, total_pages, total_count } }
  },

  createNewOrder: async (userId: string, orderData: CreateOrderParams) => {
    if (!orderData.coupon) delete orderData.coupon

    const existingOrder = await OrderModel.findOne({
      course: orderData.course,
      user: toObjectId(userId),
      status: OrderStatus.PENDING
    })

    if (existingOrder) {
      throw new BadRequestError('Order already exists')
    }

    const newOrder = await OrderModel.create({ ...orderData, user: userId })

    if (orderData.coupon) {
      await CouponModel.findByIdAndUpdate(orderData.coupon, { $inc: { used: 1 } })
    }

    await CourseModel.findByIdAndUpdate(orderData.course, { $inc: { sold: 1 } })

    await CartService.removeItemFromCart(userId, orderData.course)

    return newOrder
  },

  modifyOrderStatus: async ({ orderId, status }: UpdateOrderParams) => {
    const order = await OrderModel.findById(orderId)

    if (!order) throw new BadRequestError('Đơn hàng không tồn tại')
    if (order.status === OrderStatus.CANCELED) throw new BadRequestError('Đơn hàng đã bị hủy')

    const user = await UserModel.findById(order.user)

    if (!user) throw new BadRequestError('User not found')

    if (status === OrderStatus.COMPLETED && order.status === OrderStatus.PENDING) {
      const courseId = order.course

      if (!user.courses.includes(courseId)) {
        user.courses.push(courseId)
        await user.save()
      }
    }

    if (status === OrderStatus.CANCELED && order.status === OrderStatus.COMPLETED) {
      user.courses = user.courses.filter((course) => course.toString() !== order.course.toString())
      await user.save()
    }

    const result = await OrderModel.findByIdAndUpdate(orderId, { status })

    return result
  },

  getOrderMetrics: async () => {
    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [thisMonthCount, lastMonthCount, totalCount] = await Promise.all([
      OrderModel.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
      OrderModel.countDocuments({
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
      }),
      OrderModel.countDocuments()
    ])

    const trend = thisMonthCount === lastMonthCount ? 'neutral' : thisMonthCount > lastMonthCount ? 'asc' : 'desc'

    const changePercent =
      lastMonthCount === 0
        ? null // prevent division by zero
        : ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100

    return {
      total: totalCount,
      change: changePercent,
      trend
    }
  }
}

export default OrderService
