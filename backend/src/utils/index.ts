import mongoose from 'mongoose'

const toObjectId = (id: string) => {
  return new mongoose.Types.ObjectId(id)
}

export { toObjectId }
