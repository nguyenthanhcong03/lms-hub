import { Request, Response } from 'express'
import { OK } from '~/core/success.response'
import TrackService from '~/services/track.service'

const TrackController = {
  createOrToggleTrack: async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const result = await TrackService.createOrToggleTrack(userId, req.body)

    return new OK({
      message: 'Track toggled successfully',
      data: result
    }).send(res)
  },

  getUserTracksByCourse: async (req: Request, res: Response) => {
    const { courseId } = req.query
    const userId = req.user?._id as string
    const result = await TrackService.getUserTracksByCourse(userId, courseId as string)

    return new OK({
      message: 'Tracks retrieved successfully',
      data: result
    }).send(res)
  }
}

export default TrackController
