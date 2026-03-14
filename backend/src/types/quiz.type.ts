import { Document, Schema } from 'mongoose'
import { Question } from './question.type'

export type Feedback_mode = 'default' | 'reveal' | 'retry'

export interface Quiz extends Document {
  title: string
  limit: number
  passing_grade: number
  duration: number
  description: string
  questions: Schema.Types.ObjectId[]
}

export type QuizQueryParams = {
  limit?: number | string
  page?: number | string
  search?: string
}

export type CreateQuizParams = {
  title: string
  description: string
  questions: Question[]
  limit?: number
  passing_grade?: number
  duration?: number
}

export type UpdateQuiz = Partial<CreateQuizParams>
