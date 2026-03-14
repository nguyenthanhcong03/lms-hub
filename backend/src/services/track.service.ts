import { TrackModel } from '~/models/track.model'
import { NewTrack } from '~/types/track.type'

const TrackService = {
  createOrToggleTrack: async (userId: string, trackData: NewTrack) => {
    const { courseId, lessonId } = trackData

    const existingTrack = await TrackModel.findOne({
      lesson: lessonId,
      user: userId,
      course: courseId
    })

    let track
    if (!existingTrack) {
      track = await TrackModel.create({
        user: userId,
        course: courseId,
        lesson: lessonId
      })
    } else {
      track = await TrackModel.findOneAndDelete({
        lesson: lessonId,
        user: userId,
        course: courseId
      })
    }

    return track
  },

  getUserTracksByCourse: async (userId: string, courseId: string) => {
    const tracks = await TrackModel.find({ course: courseId, user: userId })

    return {
      result: tracks
    }
  }
}

export default TrackService
