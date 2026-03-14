import express from 'express'
import { UserRole } from '~/constants/enums'
import ReportController from '~/controllers/report.controller'
import { isAuthenticated } from '~/middlewares/auth.middleware'
import { CatchAsyncError } from '~/middlewares/catch-async-errors.middleware'
import authorizeRoles from '~/middlewares/rbac.middleware'

const router = express.Router()

router.get(
  '/metrics',
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN),
  CatchAsyncError(ReportController.getReportAllRecords)
)
router.get(
  '/revenue-by-month',
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN),
  CatchAsyncError(ReportController.getRevenueByMonth)
)

export default router
