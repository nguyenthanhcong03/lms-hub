import { Document, Schema } from 'mongoose'

export interface Video extends Document {
  video_url: string
  content: string
}
