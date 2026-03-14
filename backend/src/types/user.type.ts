import { Document, Schema } from 'mongoose'
import { UserRole, UserStatus } from '~/constants/enums'

export interface User extends Document {
  _id: string
  username: string
  email: string
  password: string
  avatar: string
  courses: Schema.Types.ObjectId[]
  status: UserStatus
  role: UserRole
  phone: string
}

export interface UserQueryParams {
  limit?: number
  page?: number
  search?: string
  status?: UserStatus
  role?: UserRole
}

export interface UpdateUserParams {
  username?: string
  email?: string
  role?: string
  status?: string
}
