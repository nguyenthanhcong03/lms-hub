import OrderModel from '~/models/order.model'
import CourseService from './course.service'
import OrderService from './order.service'
import ReviewService from './review.service'
import UserService from './user.service'
import moment from 'moment'

const ReportService = {
  getReportAllRecords: async () => {
    const [users, orders, reviews, courses] = await Promise.all([
      UserService.getUserMetrics(),
      OrderService.getOrderMetrics(),
      ReviewService.getReviewMetrics(),
      CourseService.getCourseMetrics()
    ])
    return {
      users,
      orders,
      reviews,
      ...courses
    }
  },
  getRevenueByMonth: async () => {
    const year = moment().year()
    const start = moment().startOf('year').toDate() // January 1, 00:00:00
    console.log('start', start)
    const end = moment().endOf('year').toDate() // December 31, 23:59:59.999
    console.log('end', end)

    const revenue = await OrderModel.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year,
          total: 1
        }
      },
      { $sort: { month: 1 } }
    ])

    const fullYearRevenue = Array.from({ length: 12 }, (_, i) => {
      const found = revenue.find((r) => r.month === i + 1)
      return {
        month: i + 1,
        year,
        total: found ? found.total : 0
      }
    })

    return fullYearRevenue
  }
}

export default ReportService
