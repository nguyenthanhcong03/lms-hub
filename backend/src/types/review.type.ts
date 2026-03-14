import { Schema } from 'mongoose'
import { ReviewStatus } from '~/constants/enums'

export interface Review {
  _id: string
  user: Schema.Types.ObjectId
  course: Schema.Types.ObjectId
  star: number
  content: string
  status: ReviewStatus
}

export interface CreateReviewParams {
  star: number
  content: string
  courseId: string
}

export interface UpdateReviewParams {
  star?: number
  content?: string
}

export interface ReviewQueryParams {
  page?: number | string
  limit?: number | string
  search?: string
  min_star?: number | string
  max_star?: number | string
  courseId?: string
  reviewStatus?: ReviewStatus
}
