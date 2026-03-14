import { Document, Schema } from 'mongoose'

export interface Chapter extends Document {
  _id: Schema.Types.ObjectId
  title: string
  course: Schema.Types.ObjectId
  lessons: Schema.Types.ObjectId[]
  created_at: Date
  order: number
}
export type ChapterQueryParams = {
  limit?: number | string
  page?: number | string
  search?: string
  courseId?: string
}

export interface CreateChapterParams {
  title: string
  course: string
  order: number
  lessons?: string[]
}
