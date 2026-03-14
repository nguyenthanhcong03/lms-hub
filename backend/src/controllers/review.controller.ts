import { Request, Response } from 'express'
import { BadRequestError } from '~/core/error.response'
import { CREATED, OK } from '~/core/success.response'
import ReviewService from '~/services/review.service'

const ReviewController = {
  addReview: async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const result = await ReviewService.addReview(userId, req.body)
    return new CREATED({
      message: 'Review added successfully',
      data: result
    }).send(res)
  },

  fetchReview: async (req: Request, res: Response) => {
    const { id: reviewId } = req.params
    const result = await ReviewService.fetchReviewById(reviewId)

    return new OK({
      message: 'Review fetched successfully',
      data: result
    }).send(res)
  },

  updateReview: async (req: Request, res: Response) => {
    const { id: reviewId } = req.params
    const result = await ReviewService.updateReview(reviewId, req.body)

    return new OK({
      message: 'Review updated successfully',
      data: result
    }).send(res)
  },

  updateOwnReview: async (req: Request, res: Response) => {
    const reviewId = req.params?.id
    const userId = req.user?._id as string

    const result = await ReviewService.updateOwnReview(userId, reviewId, req.body)

    return new OK({
      message: 'Your review updated successfully',
      data: result
    }).send(res)
  },

  removeReview: async (req: Request, res: Response) => {
    const { id: reviewId } = req.params
    const result = await ReviewService.removeReview(reviewId)

    return new OK({
      message: 'Review removed successfully',
      data: result
    }).send(res)
  },

  removeOwnReview: async (req: Request, res: Response) => {
    const { id: reviewId } = req.params
    const userId = req.user?._id as string
    const result = await ReviewService.removeOwnReview(userId, reviewId)

    return new OK({
      message: 'Your review removed successfully',
      data: result
    }).send(res)
  },

  removeMultipleReviews: async (req: Request, res: Response) => {
    const reviewIds = req.body.reviewIds

    if (!reviewIds || reviewIds.length === 0) {
      throw new BadRequestError('Review IDs are required')
    }

    const result = await ReviewService.removeMultipleReviews(reviewIds)

    return new OK({
      message: 'Reviews removed successfully',
      data: result
    }).send(res)
  },

  changeReviewStatus: async (req: Request, res: Response) => {
    const { id: reviewId } = req.params

    const result = await ReviewService.changeReviewStatus(reviewId, req.body)
    return new OK({
      message: 'Review status changed successfully',
      data: result
    }).send(res)
  },

  fetchAllReviews: async (req: Request, res: Response) => {
    const queryParams = req.query

    const result = await ReviewService.fetchAllReviews(queryParams)

    return new OK({
      message: 'All reviews fetched successfully',
      data: result
    }).send(res)
  },

  fetchReviewsByCourse: async (req: Request, res: Response) => {
    const queryParams = req.query

    const result = await ReviewService.fetchReviewsByCourse(queryParams)

    return new OK({
      message: 'Reviews for the course fetched successfully',
      data: result
    }).send(res)
  }
}

export default ReviewController
