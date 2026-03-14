import { model, Schema } from 'mongoose'
import { Quiz } from '~/types/quiz.type'

const QuizSchema = new Schema<Quiz>(
  {
    title: { type: String, required: true },
    limit: { type: Number, required: true },
    duration: { type: Number },
    passing_grade: { type: Number },
    description: { type: String },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
  },
  {
    timestamps: true
  }
)

const QuizModel = model<Quiz>('Quiz', QuizSchema)

export default QuizModel
