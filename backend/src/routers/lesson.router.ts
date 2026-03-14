import express from 'express'
import { UserRole } from '~/constants/enums'
import LessonController from '~/controllers/lesson.controller'
import { isAuthenticated } from '~/middlewares/auth.middleware'
import { CatchAsyncError } from '~/middlewares/catch-async-errors.middleware'
import authorizeRoles from '~/middlewares/rbac.middleware'

const router = express.Router()

router.post('/', isAuthenticated, authorizeRoles(UserRole.ADMIN), CatchAsyncError(LessonController.createLesson))
router.get('/:id', isAuthenticated, CatchAsyncError(LessonController.getLesson))
router.get('/:id/admin', isAuthenticated, CatchAsyncError(LessonController.getLessonByAdmin))
router.get('/:course', isAuthenticated, CatchAsyncError(LessonController.getAllLessons))
router.get('/:course/:slug', CatchAsyncError(LessonController.getLessonBySlug))
router.put('/:id', isAuthenticated, authorizeRoles(UserRole.ADMIN), CatchAsyncError(LessonController.updateLesson))
router.delete('/:id', isAuthenticated, authorizeRoles(UserRole.ADMIN), CatchAsyncError(LessonController.deleteLesson))

export default router
