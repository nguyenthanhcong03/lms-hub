import { model, Schema } from 'mongoose'
import { QuizType } from '~/constants/enums'
import { Option, Question } from '~/types/question.type'

const OptionSchema = new Schema<Option>({
  text: { type: String, required: true },
  is_correct: { type: Boolean, required: true }
})

const QuestionSchema = new Schema<Question>(
  {
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz' },
    question: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(QuizType),
      default: QuizType.TRUE_FALSE,
      required: true
    },
    options: [OptionSchema],
    point: { type: Number, required: true },
    explanation: String,
    required: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
)

const QuestionModel = model<Question>('Question', QuestionSchema)

export default QuestionModel
