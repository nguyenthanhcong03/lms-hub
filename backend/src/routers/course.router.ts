import express from 'express'
import CourseController from '~/controllers/course.controller'
import { isAuthenticated } from '~/middlewares/auth.middleware'
import { CatchAsyncError } from '~/middlewares/catch-async-errors.middleware'
import { validateRequestBody } from '~/middlewares/validation.middleware'
import { createCourseSchema } from '~/schemas/course.schema'

const router = express.Router()

// Use wrapRequestHandler to handle async methods
router.get('/', isAuthenticated, CatchAsyncError(CourseController.fetchAllCourses))

router.get('/me', isAuthenticated, CatchAsyncError(CourseController.fetchUserCourses))
router.get('/search', CatchAsyncError(CourseController.searchCourses))
router.get('/public', CatchAsyncError(CourseController.fetchPublicCourses))
router.get('/detail/:id', CatchAsyncError(CourseController.fetchCourseDetails))
router.get('/:slug', CatchAsyncError(CourseController.fetchCourseBySlug))
router.post(
  '/',
  isAuthenticated,
  validateRequestBody(createCourseSchema),
  CatchAsyncError(CourseController.createCourse)
)
router.put('/:slug/view', CatchAsyncError(CourseController.incrementCourseView))
router.put('/:id', isAuthenticated, CatchAsyncError(CourseController.updateCourse))

router.delete('/delete-multi', isAuthenticated, CatchAsyncError(CourseController.deleteMultipleCourses))
router.delete('/:id', isAuthenticated, CatchAsyncError(CourseController.deleteCourse))

export default router
