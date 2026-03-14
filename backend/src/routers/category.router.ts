import express from 'express'
import { UserRole } from '~/constants/enums'
import CategoryController from '~/controllers/category.controller'
import { isAuthenticated } from '~/middlewares/auth.middleware'
import { CatchAsyncError } from '~/middlewares/catch-async-errors.middleware'
import authorizeRoles from '~/middlewares/rbac.middleware'

const router = express.Router()

router.post('/', isAuthenticated, authorizeRoles(UserRole.ADMIN), CatchAsyncError(CategoryController.createCategory))
router.get('/', CatchAsyncError(CategoryController.getAllCategories))
router.get('/:id', isAuthenticated, authorizeRoles(UserRole.ADMIN), CatchAsyncError(CategoryController.getCategory))
router.put('/:id', isAuthenticated, authorizeRoles(UserRole.ADMIN), CatchAsyncError(CategoryController.updateCategory))
router.delete(
  '/delete-many',
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN),
  CatchAsyncError(CategoryController.deleteManyCategories)
)
router.delete(
  '/:id',
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN),
  CatchAsyncError(CategoryController.deleteCategory)
)

export default router
