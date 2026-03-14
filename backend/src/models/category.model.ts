import { model, Schema } from 'mongoose'
import { Category } from '~/types/category.type'

const CategorySchema = new Schema<Category>(
  {
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },

  {
    timestamps: true
  }
)

const CategoryModel = model<Category>('Category', CategorySchema)

export default CategoryModel
