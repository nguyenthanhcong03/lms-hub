import express from 'express'
import AuthController from '~/controllers/auth.controller'
import { isAuthenticated } from '~/middlewares/auth.middleware'
import { CatchAsyncError } from '~/middlewares/catch-async-errors.middleware'
import { validateRequestBody } from '~/middlewares/validation.middleware'
import { loginSchema, registerSchema, updateAuthMeSchema } from '~/schemas/auth.schema'

const router = express.Router()

router.get('/me', isAuthenticated, CatchAsyncError(AuthController.getAuthMe))
router.put(
  '/me',
  isAuthenticated,
  validateRequestBody(updateAuthMeSchema),
  CatchAsyncError(AuthController.updateAuthMe)
)
router.post('/register', validateRequestBody(registerSchema), CatchAsyncError(AuthController.register))
router.post('/login', validateRequestBody(loginSchema), CatchAsyncError(AuthController.login))
router.post('/refresh-token', CatchAsyncError(AuthController.refreshToken))
export default router
