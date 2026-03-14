import { Document, Schema } from 'mongoose'

export interface Track extends Document {
  _id: string
  course: Schema.Types.ObjectId
  lesson: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
}

export type NewTrack = {
  courseId: string
  lessonId: string
}
