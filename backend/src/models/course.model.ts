import { model, Schema } from 'mongoose'
import { CourseLevel, CourseStatus, CourseType } from '~/constants/enums'
import { Course } from '~/types/course.type'

const courseSchema = new Schema<Course>(
  {
    title: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },

    image: {
      type: String,
      default: ''
    },
    intro_url: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      default: 0
    },
    old_price: {
      type: Number,
      default: 0
    },

    type: {
      type: String,
      enum: Object.values(CourseType),
      default: CourseType.PAID
    },
    status: {
      type: String,
      enum: Object.values(CourseStatus),
      default: CourseStatus.PENDING
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    chapters: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Chapter'
      }
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    view: {
      type: Number,
      default: 0
    },
    sold: {
      type: Number,
      default: 0
    },
    info: {
      requirements: {
        type: [String]
      },
      benefits: {
        type: [String]
      },
      techniques: {
        type: [String]
      },
      documents: {
        type: [String]
      },
      qa: [
        {
          question: {
            type: String
          },
          answer: {
            type: String
          }
        }
      ]
    },

    level: {
      type: String,
      enum: Object.values(CourseLevel),
      default: CourseLevel.BEGINNER
    }
  },
  {
    timestamps: true
  }
)

const CourseModel = model<Course>('Course', courseSchema)

export default CourseModel
