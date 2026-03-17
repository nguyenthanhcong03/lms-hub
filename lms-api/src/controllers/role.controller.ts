import { Request, Response } from 'express'

import { hasPermission } from '../middlewares/rbac.middleware'
import { RoleService } from '../services/role.service'
import { sendSuccess } from '../utils/success'
import { PERMISSIONS } from '~/configs/permission'

/**
 * Role Management Controllers
 */

export class RoleController {
  private static roleService = new RoleService()

  /**
   * Get all roles
   */
  static async getRoles(req: Request, res: Response): Promise<void> {
    const roles = await RoleController.roleService.getAllRoles()

    sendSuccess.ok(res, 'Roles được lấy thành công', roles)
  }

  static async getPublicRoles(req: Request, res: Response): Promise<void> {
    const roles = await RoleController.roleService.getPublicRoles()

    sendSuccess.ok(res, 'Public roles được lấy thành công', roles)
  }

  /**
   * Get role by ID
   */
  static async getRoleById(req: Request, res: Response): Promise<void> {
    const roleId = Array.isArray(req.params.roleId) ? req.params.roleId[0] : req.params.roleId

    const role = await RoleController.roleService.getRoleById(roleId)

    sendSuccess.ok(res, 'Role được lấy thành công', role)
  }

  /**
   * Create new role
   */
  static async createRole(req: Request, res: Response): Promise<void> {
    const { name, description, permissions } = req.body
    const role = await RoleController.roleService.createRole({
      name,
      description,
      permissions
    })

    sendSuccess.created(res, 'Role được tạo thành công', role)
  }

  /**
   * Update role
   */
  static async updateRole(req: Request, res: Response): Promise<void> {
    const roleId = Array.isArray(req.params.roleId) ? req.params.roleId[0] : req.params.roleId
    const updateData = req.body

    const role = await RoleController.roleService.updateRole(roleId, updateData)

    sendSuccess.ok(res, 'Role được cập nhật thành công', role)
  }

  /**
   * Delete role with dependency checking
   */
  static async deleteRole(req: Request, res: Response): Promise<void> {
    const roleId = Array.isArray(req.params.roleId) ? req.params.roleId[0] : req.params.roleId

    await RoleController.roleService.deleteRole(roleId)

    sendSuccess.ok(res, 'Role được xóa thành công')
  }

  /**
   * Get user's permissions
   */
  static async getUserPermissions(req: Request, res: Response): Promise<void> {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId

    // Check if user can view other users' permissions or only their own
    const canViewAnyUser = hasPermission(req.userPermissions || [], PERMISSIONS.USER_READ)

    if (!canViewAnyUser && req.user?.userId !== userId) {
      res.status(403)
      return sendSuccess.ok(res, 'Từ chối truy cập: Bạn chỉ có thể xem quyền của chính mình', [])
    }

    const permissions = await RoleController.roleService.getUserPermissions(userId)

    sendSuccess.ok(res, 'User permissions được lấy thành công', { permissions })
  }

  /**
   * Get all permissions for a role
   */
  static async getRolePermissions(req: Request, res: Response): Promise<void> {
    const roleId = Array.isArray(req.params.roleId) ? req.params.roleId[0] : req.params.roleId

    const permissions = await RoleController.roleService.getAllPermissions(roleId)

    sendSuccess.ok(res, 'Role permissions được lấy thành công', { permissions })
  }
}
