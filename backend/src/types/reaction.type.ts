import { Document, Schema } from 'mongoose'
import { ReactionType } from '~/constants/enums'

export interface Reaction extends Document {
  _id: string
  comment: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
  type: ReactionType
}

export interface CreateReactionParams {
  type: ReactionType
  commentId: string
}

export interface ReactionQueryParams {
  commentId?: string
  type?: ReactionType
}
