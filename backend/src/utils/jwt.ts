import jwt from 'jsonwebtoken'
import { User } from '~/types/user.type'
interface IVerifyToken {
  token: string
  secret: string
}
const generateAccessToken = (user: User) => {
  return jwt.sign({ _id: user._id, role: user?.role }, process.env.ACCESS_TOKEN_SECRET || '', {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn']
  })
}

const generateRefreshToken = (user: User) => {
  return jwt.sign({ _id: user._id, role: user?.role }, process.env.REFRESH_TOKEN_SECRET || '', {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn']
  })
}

const verifyToken = ({ token, secret }: IVerifyToken): string | jwt.JwtPayload => {
  return jwt.verify(token, secret)
}

export { generateAccessToken, generateRefreshToken, verifyToken }
