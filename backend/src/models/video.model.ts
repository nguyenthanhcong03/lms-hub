import { model, Schema } from 'mongoose'
import { Video } from '~/types/video.type'

const VideoSchema = new Schema<Video>(
  {
    video_url: {
      type: String
    },
    content: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

const VideoModel = model<Video>('Video', VideoSchema)

export default VideoModel
