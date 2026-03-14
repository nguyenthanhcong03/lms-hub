import { Request, Response } from 'express'
import { CREATED, OK } from '~/core/success.response'
import OrderService from '~/services/order.service'

const OrderController = {
  fetchAllOrders: async (req: Request, res: Response) => {
    const queryParams = req.query

    const result = await OrderService.fetchAllOrders(queryParams)

    return new OK({
      message: 'Orders retrieved successfully',
      data: result
    }).send(res)
  },

  fetchUserOrders: async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const queryParams = req.query

    const result = await OrderService.fetchUserOrders(userId, queryParams)

    return new OK({
      message: 'User orders retrieved successfully',
      data: result
    }).send(res)
  },

  createNewOrder: async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const result = await OrderService.createNewOrder(userId, req.body)

    return new CREATED({
      message: 'Order created successfully',
      data: result
    }).send(res)
  },

  modifyOrderStatus: async (req: Request, res: Response) => {
    const orderId = req.params.id
    const result = await OrderService.modifyOrderStatus({ orderId, status: req.body.status })

    return new OK({
      message: 'Order status updated successfully',
      data: result
    }).send(res)
  }
}

export default OrderController
