import { Request, Response } from 'express'
import { OK } from '~/core/success.response'
import QuizAttemptService from '~/services/quiz-attempt.service'

const QuizAttemptController = {
  updateQuizAttempt: async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const id = req.params.id as string
    const result = await QuizAttemptService.updateQuizAttempt(userId, id, req.body)
    return new OK({
      message: 'Quiz attempt created successfully',
      data: result
    }).send(res)
  },

  createQuizAttempt: async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const quizId = req.body.quizId as string
    const result = await QuizAttemptService.createQuizAttempt(userId, quizId)
    return new OK({
      message: 'Quiz attempt started successfully',
      data: result
    }).send(res)
  },

  fetchAllQuizAttemptsByUser: async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const result = await QuizAttemptService.fetchAllQuizAttemptsByUser(userId, req.query)
    return new OK({
      message: 'All quiz attempts retrieved successfully',
      data: result
    }).send(res)
  },

  fetchQuizAttemptEndTime: async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const quizId = req.query.quizId as string
    const result = await QuizAttemptService.fetchQuizAttemptEndTime(userId, quizId)
    return new OK({
      message: 'Quiz attempt end time retrieved successfully',
      data: result
    }).send(res)
  },
  fetchQuizAttemptById: async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const quizAttemptId = req.params.id as string
    const result = await QuizAttemptService.fetchQuizAttemptById(userId, quizAttemptId)
    return new OK({
      message: 'Quiz attempt retrieved successfully',
      data: result
    }).send(res)
  }
}

export default QuizAttemptController
