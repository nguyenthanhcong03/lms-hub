import QuestionModel from '~/models/question.model'

const QuestionService = {
  fetchAllQuestionsByLesson: async (queryParams: any) => {
    const { quiz } = queryParams

    const questions = await QuestionModel.find({ quiz }).lean()

    const sanitizedQuestions = questions.map((q) => ({
      ...q,
      options: q.options.map(({ is_correct, ...rest }) => rest)
    }))

    return sanitizedQuestions
  }
}

export default QuestionService
