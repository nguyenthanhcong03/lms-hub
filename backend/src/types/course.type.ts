import { Document, Schema } from 'mongoose'
import { CourseLevel, CourseStatus, CourseType } from '~/constants/enums'

export interface Course extends Document {
  _id: Schema.Types.ObjectId
  title: string
  image: string
  is_published: boolean
  intro_url: string
  description: string
  category: Schema.Types.ObjectId
  price: number
  old_price: number
  slug: string
  type: CourseType
  status: CourseStatus
  level: CourseLevel
  view: number
  sold: number
  info: {
    requirements: string[]
    benefits: string[]
    techniques: string[]
    documents: string[]
    qa: {
      question: string
      answer: string
    }[]
  }
  chapters: Schema.Types.ObjectId[]
  author: Schema.Types.ObjectId
}

export type CourseQueryParams = {
  page?: number | string
  limit?: number | string
  search?: string
  status?: string
  level?: CourseLevel
  min_price?: number | string
  max_price?: number | string
  sort_by?: string
  order?: string
  min_star?: number | string
  max_star?: number | string
  category?: string
}
export type CreateCourseParams = {
  title: string
  slug: string
  userId: string
}
