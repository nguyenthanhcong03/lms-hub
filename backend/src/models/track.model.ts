import { model, Schema } from 'mongoose'
import { Track } from '~/types/track.type'

const TrackSchema = new Schema<Track>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

export const TrackModel = model<Track>('Track', TrackSchema)
