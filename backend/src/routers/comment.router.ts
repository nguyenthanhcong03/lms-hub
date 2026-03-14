import express from 'express'
import { UserRole } from '~/constants/enums'
import CommentController from '~/controllers/comment.controller'
import { isAuthenticated } from '~/middlewares/auth.middleware'
import { CatchAsyncError } from '~/middlewares/catch-async-errors.middleware'
import authorizeRoles from '~/middlewares/rbac.middleware'
import { validateRequestBody } from '~/middlewares/validation.middleware'
import { createCommentSchema } from '~/schemas/comment.schema'

const router = express.Router()
router.post(
  '/',
  isAuthenticated,
  validateRequestBody(createCommentSchema),
  CatchAsyncError(CommentController.createComment)
)
router.get(
  '/',
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.EXPERT),
  CatchAsyncError(CommentController.getAllComments)
)
router.get('/lesson', isAuthenticated, CatchAsyncError(CommentController.getAllCommentsByLesson))
router.get('/replies', isAuthenticated, CatchAsyncError(CommentController.getReplies))
router.get('/:id', isAuthenticated, CatchAsyncError(CommentController.getComment))
router.put(
  '/change-status/:id',
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN),
  CatchAsyncError(CommentController.changeCommentStatus)
)
router.put('/:id', isAuthenticated, CatchAsyncError(CommentController.updateComment))
router.delete('/delete-many', CatchAsyncError(CommentController.deleteMultipleComments))
router.delete('/:id', isAuthenticated, CatchAsyncError(CommentController.deleteComment))
export default router
