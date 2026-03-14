import { model, Schema } from 'mongoose'
import { LessonType } from '~/constants/enums'
import { Lesson } from '~/types/lesson.type'

const lessonSchema = new Schema<Lesson>(
  {
    title: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0
    },

    resource: {
      type: Schema.Types.ObjectId,
      refPath: 'resourceType'
    },
    resourceType: {
      type: String,
      required: true,
      enum: ['Video', 'Quiz']
    },
    chapter: {
      type: Schema.Types.ObjectId,
      ref: 'Chapter'
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    },
    type: {
      type: String,
      enum: Object.values(LessonType),
      default: LessonType.VIDEO
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

const LessonModel = model<Lesson>('Lesson', lessonSchema)

export default LessonModel
