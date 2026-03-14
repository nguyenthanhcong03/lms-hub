import { Request, Response } from 'express'
import { OK } from '~/core/success.response'
import UserService from '~/services/user.service'

const UserController = {
  // Fetch details of a specific user by ID
  fetchUserDetails: async (req: Request, res: Response) => {
    const { id } = req.params

    const result = await UserService.fetchUserDetails(id)
    return new OK({
      message: 'User details retrieved successfully',
      data: result
    }).send(res)
  },

  // Retrieve a list of all users with optional query parameters
  fetchAllUsers: async (req: Request, res: Response) => {
    const params = req.query

    const result = await UserService.fetchAllUsers(params)

    return new OK({
      message: 'All users retrieved successfully',
      data: result
    }).send(res)
  },

  // Update user information by ID
  updateUser: async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await UserService.updateUser(id, req.body)

    return new OK({
      message: 'User information updated successfully',
      data: result
    }).send(res)
  }
}

export default UserController
