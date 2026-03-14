import express from 'express'
import { UserRole } from '../constants/enums'
import ReviewController from '../controllers/review.controller'
import { isAuthenticated } from '../middlewares/auth.middleware'
import { CatchAsyncError } from '../middlewares/catch-async-errors.middleware'
import authorizeRoles from '../middlewares/rbac.middleware'

const router = express.Router()

router.get('/', CatchAsyncError(ReviewController.fetchAllReviews))
router.get('/course', CatchAsyncError(ReviewController.fetchReviewsByCourse))
router.get('/:id', isAuthenticated, CatchAsyncError(ReviewController.fetchReview))
router.post('/', isAuthenticated, CatchAsyncError(ReviewController.addReview))
router.put('/:id', isAuthenticated, CatchAsyncError(ReviewController.updateReview))
router.put(
  '/change-status/:id',
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN),
  CatchAsyncError(ReviewController.changeReviewStatus)
)
router.put('/me/:id', isAuthenticated, CatchAsyncError(ReviewController.updateOwnReview))
router.delete('/me/:id', isAuthenticated, CatchAsyncError(ReviewController.removeOwnReview))
router.delete('/delete-many', CatchAsyncError(ReviewController.removeMultipleReviews))
router.delete('/:id', isAuthenticated, CatchAsyncError(ReviewController.removeReview))
export default router
