import { Request, Response } from 'express'
import { BadRequestError } from '~/core/error.response'
import { OK } from '~/core/success.response'
import QuizService from '~/services/quiz.service'

const QuizController = {
  createQuiz: async (req: Request, res: Response) => {
    const userId = req?.user?._id as string
    const result = await QuizService.createQuiz(userId, req.body)
    return new OK({
      message: 'Create quiz successfully',
      data: result
    }).send(res)
  }

  // getQuiz: async (req: Request, res: Response) => {
  //   const { id } = req.params
  //   const result = await QuizService.getQuiz(id)
  //   return new OK({
  //     message: 'Get Quiz successfully',
  //     data: result
  //   }).send(res)
  // },

  // updateQuiz: async (req: Request, res: Response) => {
  //   const { id } = req.params
  //   const result = await QuizService.updateQuiz(id, req.body)
  //   return new OK({
  //     message: 'Update Quiz successfully',
  //     data: result
  //   }).send(res)
  // },

  // deleteQuiz: async (req: Request, res: Response) => {
  //   const { id } = req.params
  //   const result = await QuizService.deleteQuiz(id)

  //   return new OK({
  //     message: 'Delete Quiz successfully',
  //     data: result
  //   }).send(res)
  // },

  // deleteManyQuiz: async (req: Request, res: Response) => {
  //   const ids = req.body.QuizIds

  //   if (!ids || ids.length === 0) {
  //     throw new BadRequestError('Product type ids are required')
  //   }

  //   const result = await QuizService.deleteManyQuiz(ids)
  //   return new OK({
  //     message: 'Delete many Quiz successfully',
  //     data: result
  //   }).send(res)
  // },

  // getAllQuiz: async (req: Request, res: Response) => {
  //   const params = req.query

  //   const result = await QuizService.getAllQuiz(params)
  //   return new OK({
  //     message: 'Get all Quiz successfully',
  //     data: result
  //   }).send(res)
  // }
}

export default QuizController
