import { model, Schema } from 'mongoose'
import { ReactionType } from '~/constants/enums'
import { Reaction } from '~/types/reaction.type'

const ReactionSchema = new Schema<Reaction>(
  {
    type: {
      type: String,
      required: true,
      enum: Object.values(ReactionType)
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      required: true
    }
  },
  {
    timestamps: true
  }
)
const ReactionModel = model<Reaction>('Reaction', ReactionSchema)

export default ReactionModel
