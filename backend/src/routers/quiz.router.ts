import express from 'express'
import { UserRole } from '~/constants/enums'
import QuizController from '~/controllers/quiz.controller'
import { isAuthenticated } from '~/middlewares/auth.middleware'
import { CatchAsyncError } from '~/middlewares/catch-async-errors.middleware'
import authorizeRoles from '~/middlewares/rbac.middleware'

const router = express.Router()

router.post('/', isAuthenticated, authorizeRoles(UserRole.ADMIN), CatchAsyncError(QuizController.createQuiz))

export default router
