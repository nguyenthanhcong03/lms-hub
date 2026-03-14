import { Request, Response } from 'express'
import { OK } from '~/core/success.response'
import QuestionService from '~/services/question.service'

const QuestionController = {
  fetchAllQuestionsByLesson: async (req: Request, res: Response) => {
    const result = await QuestionService.fetchAllQuestionsByLesson(req.query)
    return new OK({
      message: 'All questions retrieved successfully',
      data: result
    }).send(res)
  }
}

export default QuestionController
