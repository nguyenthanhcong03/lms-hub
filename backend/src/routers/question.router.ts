import express from 'express'
import QuestionController from '~/controllers/question.controller'

import { isAuthenticated } from '~/middlewares/auth.middleware'
import { CatchAsyncError } from '~/middlewares/catch-async-errors.middleware'

const router = express.Router()

router.get('/', isAuthenticated, CatchAsyncError(QuestionController.fetchAllQuestionsByLesson))

export default router
