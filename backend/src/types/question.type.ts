import { Schema } from 'mongoose'
import { QuizType } from '~/constants/enums'

export interface Option {
  _id: Schema.Types.ObjectId
  text: string
  is_correct: boolean
}

export interface Question {
  _id: Schema.Types.ObjectId
  quiz: Schema.Types.ObjectId
  question: string
  type: QuizType
  options: Option[]
  explanation?: string
  point: number
  required?: boolean
}
