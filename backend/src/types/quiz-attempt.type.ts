import { Document, Schema } from 'mongoose'

export interface QuizAttempt extends Document {
  lesson: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
  quiz: Schema.Types.ObjectId
  answers: {
    question: Schema.Types.ObjectId
    selected_answers: string[]
    is_correct: boolean
  }[]
  total_point: number
  earned_point: number
  time_taken: number
  is_passed: boolean
  passing_grade: number
  start_time: Date
  end_time: Date
  is_submitted: boolean
}

export type QuizAttemptQueryParams = {
  limit?: number | string
  page?: number | string
  search?: string
  quizId?: string
}

export type CreateQuizAttempt = {
  lesson: string
  answers: {
    questionId: string
    selected_answers: string[]
    is_correct: boolean
  }[]
  quizAttemptId?: string
}

export type UpdateQuiz = Partial<CreateQuizAttempt>
