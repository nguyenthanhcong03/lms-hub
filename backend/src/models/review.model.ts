import { model, Schema } from 'mongoose'
import { ReviewStatus } from '~/constants/enums'
import { Review } from '~/types/review.type'

const ReviewSchema = new Schema<Review>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    },
    star: {
      type: Number,
      default: 5
    },

    content: {
      type: String
    },
    status: {
      type: String,
      enum: Object.values(ReviewStatus),
      default: ReviewStatus.ACTIVE
    }
  },
  {
    timestamps: true
  }
)

const ReviewModel = model<Review>('Review', ReviewSchema)

export default ReviewModel
