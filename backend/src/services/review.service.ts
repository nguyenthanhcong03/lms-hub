import { FilterQuery } from 'mongoose'
import { ReviewStatus } from '~/constants/enums'
import { BadRequestError } from '~/core/error.response'
import ReviewModel from '~/models/review.model'

import { CreateReviewParams, UpdateReviewParams, ReviewQueryParams } from '~/types/review.type'
import { toObjectId } from '~/utils'

const ReviewService = {
  addReview: async (userId: string, reviewData: CreateReviewParams) => {
    const payload = {
      star: reviewData.star,
      content: reviewData.content,
      user: userId,
      course: reviewData.courseId
    }
    const newReview = (await ReviewModel.create(payload)).populate('user', 'username avatar')
    return newReview
  },

  fetchReviewById: async (reviewId: string) => {
    const review = await ReviewModel.findById(reviewId).populate('course', 'title')

    if (!review) {
      throw new Error('Review not found')
    }

    return review
  },

  updateReview: async (reviewId: string, updateData: UpdateReviewParams) => {
    const updatedReview = await ReviewModel.findByIdAndUpdate(reviewId, updateData, { new: true, runValidators: true })

    if (!updatedReview) {
      throw new Error('Review not found')
    }

    return updatedReview
  },

  updateOwnReview: async (userId: string, reviewId: string, updateData: UpdateReviewParams) => {
    const existingReview = await ReviewModel.findById(reviewId)
    if (!existingReview) {
      throw new BadRequestError('Review not found')
    }

    if (userId !== existingReview.user.toString()) {
      throw new BadRequestError('You are not allowed to update this review')
    }

    const updatedReview = await ReviewModel.findByIdAndUpdate(reviewId, updateData, { new: true, runValidators: true })

    return updatedReview
  },

  removeOwnReview: async (userId: string, reviewId: string) => {
    const existingReview = await ReviewModel.findById(reviewId)

    if (!existingReview) {
      throw new BadRequestError('Review not found')
    }

    if (existingReview.user.toString() !== userId) {
      throw new BadRequestError('You are not allowed to delete this review')
    }

    const deletedReview = await ReviewModel.findByIdAndDelete(reviewId)

    return deletedReview
  },

  changeReviewStatus: async (reviewId: string, statusData: { userId: string; status: string }) => {
    const { status } = statusData
    await ReviewModel.findByIdAndUpdate(reviewId, { status }, { new: true, runValidators: true })
  },

  fetchAllReviews: async (queryParams: ReviewQueryParams) => {
    const limit = +(queryParams?.limit ?? 10)
    const search = queryParams?.search || ''
    const page = +(queryParams?.page ?? 1)
    const status = queryParams?.reviewStatus || ''

    const query: FilterQuery<typeof ReviewModel> = {}

    if (status) {
      query.status = status
    }

    if (search) {
      query.$or = [{ content: { $regex: search, $options: 'i' } }]
    }

    const skip = (page - 1) * limit

    const [reviews, totalCount] = await Promise.all([
      ReviewModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).populate('user', 'username avatar email'),
      ReviewModel.countDocuments(query)
    ])
    const total_pages = Math.ceil(totalCount / limit)
    return { reviews, pagination: { page, per_page: limit, total_pages, totalCount } }
  },

  fetchReviewsByCourse: async (queryParams: ReviewQueryParams) => {
    const limit = +(queryParams?.limit ?? 10)
    const search = queryParams?.search || ''
    const page = +(queryParams?.page ?? 1)
    const min_star = +(queryParams?.min_star ?? 0)
    const max_star = +(queryParams?.max_star ?? 5)
    const courseId = queryParams?.courseId || ''

    const query: FilterQuery<typeof ReviewModel> = {
      status: ReviewStatus.ACTIVE,
      course: toObjectId(courseId)
    }

    if (search) {
      query.$or = [{ content: { $regex: search, $options: 'i' } }]
    }

    if (min_star && max_star) {
      query.star = { $gte: min_star, $lte: max_star }
    }

    const skip = (page - 1) * limit

    const [total_count, reviews, additionalInfo] = await Promise.all([
      ReviewModel.countDocuments(query),
      ReviewModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).populate('user', 'username avatar'),
      ReviewModel.aggregate([
        {
          $match: query
        },
        {
          $group: {
            _id: { $ceil: '$star' },
            count: { $sum: 1 },
            totalStars: { $sum: '$star' }
          }
        },
        {
          $facet: {
            rating_distribution: [
              {
                $project: {
                  star: '$_id',
                  count: 1,
                  _id: 0
                }
              },
              {
                $sort: { star: -1 }
              }
            ],
            average_rating: [
              {
                $group: {
                  _id: null,
                  totalStars: { $sum: '$totalStars' },
                  totalCount: { $sum: '$count' }
                }
              },
              {
                $project: {
                  average_rating: {
                    $round: [{ $divide: ['$totalStars', '$totalCount'] }, 1]
                  },
                  _id: 0
                }
              }
            ]
          }
        },
        {
          $project: {
            rating_distribution: '$rating_distribution',
            average_rating: { $arrayElemAt: ['$average_rating.average_rating', 0] }
          }
        }
      ])
    ])
    const total_pages = Math.ceil(total_count / limit)

    return {
      reviews,
      pagination: { page, per_page: limit, total_pages, total_count },
      ...additionalInfo[0]
    }
  },

  removeReview: async (reviewId: string) => {
    const deletedReview = await ReviewModel.findByIdAndDelete(reviewId)
    return deletedReview
  },

  removeMultipleReviews: async (reviewIds: string[]) => {
    return await ReviewModel.deleteMany({ _id: { $in: reviewIds } })
  },
  getReviewMetrics: async () => {
    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [thisMonthCount, lastMonthCount, totalCount] = await Promise.all([
      ReviewModel.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
      ReviewModel.countDocuments({
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
      }),
      ReviewModel.countDocuments()
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

export default ReviewService
