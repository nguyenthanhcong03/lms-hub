import { Schema } from 'mongoose'
import { LessonType } from '~/constants/enums'
import { Question } from './question.type'

export interface Lesson extends Document {
  _id: Schema.Types.ObjectId
  title: string
  slug: string
  chapter: Schema.Types.ObjectId
  course: Schema.Types.ObjectId
  order: number
  duration: number
  type: LessonType
  resource: Schema.Types.ObjectId
  resourceType: LessonType
  created_by: Schema.Types.ObjectId
}

export interface CreateLessonParams {
  title: string
  slug: string
  chapterId: string
  courseId: string
  order?: number
  duration?: number
  video_url?: string
  content?: string
  type: LessonType
  description: string
  questions: Question[]
  limit?: number
  passing_grade?: number
}

export interface LessonQueryParams {
  course: string
}
