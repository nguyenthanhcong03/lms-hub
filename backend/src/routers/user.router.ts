// Import necessary modules and middleware
import express from 'express'
// Express router for handling user-related routes
import { UserRole } from '~/constants/enums'
// Middleware for authentication and role-based access control
import UserController from '~/controllers/user.controller'
// Controller for user-related operations
import { isAuthenticated } from '~/middlewares/auth.middleware'
// Middleware for authentication
import { CatchAsyncError } from '~/middlewares/catch-async-errors.middleware'
// Utility for handling asynchronous errors
import authorizeRoles from '~/middlewares/rbac.middleware'
// Middleware for role-based access control

const router = express.Router()

router.get(
  '/',
  isAuthenticated, // Ensure the user is authenticated
  authorizeRoles(UserRole.ADMIN), // Restrict access to admin users
  CatchAsyncError(UserController.fetchAllUsers) // Fetch all users
)

router.get(
  '/:id',
  isAuthenticated, // Ensure the user is authenticated
  authorizeRoles(UserRole.ADMIN), // Restrict access to admin users
  CatchAsyncError(UserController.fetchUserDetails) // Fetch details of a specific user
)

router.put(
  '/:id',
  isAuthenticated, // Ensure the user is authenticated
  authorizeRoles(UserRole.ADMIN), // Restrict access to admin users
  CatchAsyncError(UserController.updateUser) // Update user information
)

export default router
