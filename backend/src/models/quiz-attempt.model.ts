import { model, Schema } from 'mongoose'
import { QuizAttempt } from '~/types/quiz-attempt.type'
const QuizAttemptSchema = new Schema<QuizAttempt>(
  {
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz' },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    answers: [
      {
        question: { type: Schema.Types.ObjectId, ref: 'Question' },
        selected_answers: [Schema.Types.ObjectId],
        is_correct: Boolean
      }
    ],
    earned_point: {
      type: Number,
      required: true
    },
    total_point: {
      type: Number,
      required: true
    },
    time_taken: {
      type: Number,
      required: true
    },
    is_passed: {
      type: Boolean,
      default: false
    },
    passing_grade: {
      type: Number,
      required: true
    },
    start_time: {
      type: Date,
      required: true
    },
    end_time: {
      type: Date,
      required: true
    },
    is_submitted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const QuizAttemptModel = model<QuizAttempt>('QuizAttempt', QuizAttemptSchema)

export default QuizAttemptModel
