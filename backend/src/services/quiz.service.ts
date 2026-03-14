import mongoose, { ObjectId } from 'mongoose'
import QuestionModel from '~/models/question.model'
import QuizModel from '~/models/quiz.model'
import { CreateQuizParams } from '~/types/quiz.type'

const QuizService = {
  createQuiz: async (userId: string, body: CreateQuizParams) => {
    const { questions, ...rests } = body

    // 1. Create questions in DB
    const createdQuestions = await Promise.all(
      questions.map((q) => {
        return QuestionModel.create({
          quiz: null, // temporarily null
          question: q.question,
          type: q.type,
          options: q.options,
          explanation: q.explanation,
          point: q.point,
          required: q.required
        })
      })
    )

    const questionIds = createdQuestions.map((q) => q._id)

    // 2. Create quiz
    const newQuiz = await QuizModel.create({
      ...rests,
      created_by: userId,
      questions: questionIds
    })

    // 3. Update questions with quizId
    await Promise.all(
      createdQuestions.map((q) => {
        q.quiz = newQuiz._id as ObjectId
        return q.save()
      })
    )

    return newQuiz
  },

  updateQuiz: async (quizId: string, body: Partial<CreateQuizParams>) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const { questions, ...quizFields } = body

      // 1. Update Quiz (basic fields)
      await QuizModel.findByIdAndUpdate(quizId, { $set: { ...quizFields } }, { session })

      const questionIds = []

      for (const q of questions ?? []) {
        if (q._id) {
          // Existing question → update
          await QuestionModel.findByIdAndUpdate(
            q._id,
            {
              $set: {
                question: q.question,
                type: q.type,
                point: q.point,
                required: q.required,
                options: q.options
              }
            },
            { session }
          )
          questionIds.push(q._id)
        } else {
          // New question → insert
          const created = await QuestionModel.create(
            [
              {
                quiz: quizId,
                question: q.question,
                type: q.type,
                point: q.point,
                required: q.required,
                options: q.options
              }
            ],
            { session }
          )
          questionIds.push(created[0]._id)
        }
      }

      // Delete questions not in the updated list
      await QuestionModel.deleteMany(
        {
          quiz: quizId,
          _id: { $nin: questionIds }
        },
        { session }
      )

      // 3. Update Quiz.questions with synced list
      await QuizModel.findByIdAndUpdate(
        quizId,
        {
          $set: {
            questions: questionIds
          }
        },
        { session }
      )

      await session.commitTransaction()
      session.endSession()

      return { success: true }
    } catch (err) {
      await session.abortTransaction()
      session.endSession()
      console.error('Quiz update failed:', err)
      throw err
    }
  }
}

export default QuizService
