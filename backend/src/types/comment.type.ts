import { Schema } from 'mongoose'
import { CommentStatus } from '~/constants/enums'

export interface Comment extends Document {
  _id: Schema.Types.ObjectId
  content: string
  lesson: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
  status: CommentStatus
  parentId?: Schema.Types.ObjectId
  mentions?: Schema.Types.ObjectId[]
}
export type TParamsGetComments = {
  limit?: number | string
  page?: number | string
  search?: string
  lessonId?: string
  status?: CommentStatus
}

export type CreateCommentParams = {
  lessonId: string
  content: string
  parentId?: string
  mentions?: string[]
}

export type TParamsEditComment = {
  content?: string
  mentions?: string[]
}
