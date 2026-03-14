import { Document } from 'mongoose'

export interface Category extends Document {
  _id: string
  name: string
  slug: string
  created_by?: string
}

export type CategoryQueryParams = {
  limit?: number | string
  page?: number | string
  search?: string
}

export type CreateCategoryParams = {
  name: string
  slug: string
}
