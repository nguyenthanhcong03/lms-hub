import { model, Schema } from 'mongoose'
import { UserRole, UserStatus } from '~/constants/enums'
import { User } from '~/types/user.type'

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE
    },
    avatar: {
      type: String
    },
    phone: {
      type: String
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course'
      }
    ],

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER
    }
  },
  {
    timestamps: true
  }
)

const UserModel = model<User>('User', userSchema)

export default UserModel
