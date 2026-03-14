import express from 'express'
import { UserRole } from '~/constants/enums'
import ChapterController from '~/controllers/chapter.controller'
import { isAuthenticated } from '~/middlewares/auth.middleware'
import { CatchAsyncError } from '~/middlewares/catch-async-errors.middleware'
import authorizeRoles from '~/middlewares/rbac.middleware'

const router = express.Router()

router.get('', isAuthenticated, CatchAsyncError(ChapterController.getAllChapters))
router.get('/:id', isAuthenticated, authorizeRoles(UserRole.ADMIN), CatchAsyncError(ChapterController.getChapter))
router.post('/', isAuthenticated, authorizeRoles(UserRole.ADMIN), CatchAsyncError(ChapterController.createChapter))
router.put('/:id', isAuthenticated, authorizeRoles(UserRole.ADMIN), CatchAsyncError(ChapterController.updateChapter))
router.delete('/:id', isAuthenticated, authorizeRoles(UserRole.ADMIN), CatchAsyncError(ChapterController.deleteChapter))

export default router
