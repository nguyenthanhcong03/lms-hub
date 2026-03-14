import { BadRequestError } from '~/core/error.response'
import QuestionModel from '~/models/question.model'
import QuizAttemptModel from '~/models/quiz-attempt.model'
import QuizModel from '~/models/quiz.model'
import { CreateQuizAttempt, QuizAttemptQueryParams } from '~/types/quiz-attempt.type'

const QuizAttemptService = {
  createQuizAttempt: async (userId: string, quizId: string) => {
    const quizAttempt = await QuizAttemptModel.findOne({
      user: userId,
      quiz: quizId,
      end_time: { $gt: new Date() },
      is_submitted: false
    })

    if (quizAttempt) throw new BadRequestError('There is a quiz attempt in progress')

    const quiz = await QuizModel.findById(quizId)
    if (!quiz) throw new BadRequestError('Quiz not found')

    const startTime = new Date()
    const endTime = new Date(startTime.getTime() + quiz?.duration * 1000)

    const newQuizAttempt = await QuizAttemptModel.create({
      user: userId,
      quiz: quizId,
      answers: [],
      earned_point: 0,
      total_point: 0,
      time_taken: 0,
      is_passed: false,
      passing_grade: quiz?.passing_grade || 0,
      start_time: startTime,
      end_time: endTime
    })

    return newQuizAttempt
  },
  updateQuizAttempt: async (userId: string, id: string, body: CreateQuizAttempt) => {
    const { answers } = body

    let earnedPoints = 0
    let totalPoints = 0
    const updatedAnswers = []

    for (const item of answers) {
      const question = await QuestionModel.findById(item?.questionId).lean()
      const correct = question?.options?.filter((opt) => opt.is_correct)?.map((opt) => String(opt._id))

      const selected = item.selected_answers

      const isCorrect = correct?.length === selected?.length && correct?.every((id) => selected?.includes(id))

      if (isCorrect) earnedPoints += question?.point ?? 0
      totalPoints += question?.point ?? 0

      updatedAnswers.push({
        question: question?._id,
        selected_answers: selected,
        is_correct: isCorrect
      })
    }

    const attempt = await QuizAttemptModel.findOne({ user: userId, _id: id })

    if (!attempt) throw new BadRequestError('Quiz attempt not found')

    const quizAttempt = await QuizAttemptModel.findOneAndUpdate(
      { user: userId, _id: id },
      {
        answers: updatedAnswers,
        earned_point: earnedPoints,
        total_point: totalPoints,
        is_passed: (earnedPoints / totalPoints) * 100 >= attempt.passing_grade,
        time_taken: Math.floor((Date.now() - new Date(attempt.start_time).getTime()) / 1000),
        is_submitted: true
      },
      { new: true }
    ).lean()

    return quizAttempt
  },

  fetchAllQuizAttemptsByUser: async (userId: string, queryParams: QuizAttemptQueryParams) => {
    const { quizId } = queryParams

    const quizAttempts = await QuizAttemptModel.find({ user: userId, quiz: quizId }).sort({ createdAt: -1 }).lean()

    return quizAttempts
  },

  fetchQuizAttemptEndTime: async (userId: string, quizId: string) => {
    const quizAttempt = await QuizAttemptModel.findOne({
      user: userId,
      quiz: quizId,
      end_time: { $gt: new Date() }, // Ensure the quiz attempt is still active
      is_submitted: false
    })
      .select('end_time')
      .lean()

    return quizAttempt
  },
  fetchQuizAttemptById: async (userId: string, quizAttemptId: string) => {
    const quizAttempt = await QuizAttemptModel.findOne({ user: userId, _id: quizAttemptId })
      .populate('quiz')
      .populate('answers.question')
      .populate('answers.selected_answers')
      .lean()

    return quizAttempt
  }
}

export default QuizAttemptService
