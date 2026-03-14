import express from 'express'
import QuizAttemptController from '~/controllers/quiz-attempt.controller'
import { isAuthenticated } from '~/middlewares/auth.middleware'
import { CatchAsyncError } from '~/middlewares/catch-async-errors.middleware'

const router = express.Router()

router.put('/:id', isAuthenticated, CatchAsyncError(QuizAttemptController.updateQuizAttempt))
router.post('/', isAuthenticated, CatchAsyncError(QuizAttemptController.createQuizAttempt))
router.get('/', isAuthenticated, CatchAsyncError(QuizAttemptController.fetchAllQuizAttemptsByUser))
router.get('/end-time', isAuthenticated, CatchAsyncError(QuizAttemptController.fetchQuizAttemptEndTime))
router.get('/:id', isAuthenticated, CatchAsyncError(QuizAttemptController.fetchQuizAttemptById))
export default router
