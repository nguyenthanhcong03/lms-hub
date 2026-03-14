import { model, Schema } from 'mongoose'

import { CommentStatus } from '~/constants/enums'
import { Comment } from '~/types/comment.type'

const commentSchema = new Schema<Comment>(
  {
    content: {
      type: String,
      required: true
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      default: CommentStatus.APPROVED,
      enum: Object.values(CommentStatus)
    },

    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    },
    mentions: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: []
    }
  },
  {
    timestamps: true
  }
)
const CommentModel = model<Comment>('Comment', commentSchema)

export default CommentModel
