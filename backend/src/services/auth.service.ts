import bcrypt from 'bcrypt'
import { BadRequestError, NotFoundError } from '~/core/error.response'
import UserModel from '~/models/user.model'
import { LoginData, registrationData, UpdateAuthMeParams } from '~/types/auth.type'

import { generateAccessToken, generateRefreshToken, verifyToken } from '~/utils/jwt'

const AuthService = {
  register: async (registrationData: registrationData) => {
    const { email, password } = registrationData

    const findUser = await UserModel.findOne({ email })
    if (findUser) {
      throw new BadRequestError('Người dùng đã tồn tại')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await UserModel.create({ ...registrationData, password: hashedPassword })

    return newUser
  },

  login: async (loginData: LoginData) => {
    const { email, password } = loginData
    const user = await UserModel.findOne({ email }).select('+password')

    if (!user) {
      throw new BadRequestError('email hoặc mật khẩu không đúng')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new BadRequestError('email hoặc mật khẩu không đúng')
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    const { password: _, ...userDetails } = user.toObject()

    return { accessToken, refreshToken, user: userDetails }
  },

  getAuthMe: async (userId: string) => {
    const user = await UserModel.findById(userId).select('-password')

    if (!user) {
      throw new NotFoundError('Người dùng không tồn tại')
    }

    return user
  },

  updateAuthMe: async (userId: string, updateData: UpdateAuthMeParams) => {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true
    }).select('-password')

    return updatedUser
  },

  refreshToken: async (token: string) => {
    if (!token) {
      throw new BadRequestError('Refresh token is required')
    }

    const { _id } = verifyToken({ token, secret: process.env.REFRESH_TOKEN_SECRET || '' }) as { _id: string }

    const user = await UserModel.findById(_id)

    if (!user) {
      throw new NotFoundError('Người dùng không tồn tại')
    }

    const newAccessToken = generateAccessToken(user)

    return { accessToken: newAccessToken }
  }
}

export default AuthService
