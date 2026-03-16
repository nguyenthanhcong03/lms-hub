import { Role, IRole } from '../models/role'
import { User } from '../models/user'
import { NotFoundError, ConflictError } from '../utils/errors'
import { Permission, SYSTEM_ROLE_NAMES } from '~/configs/permission'

interface RoleWithUserCount extends Record<string, unknown> {
  totalUsers: number
}

interface RoleInput {
  name: string
  permissions: Permission[]
  description?: string
}

interface UpdateRoleInput {
  name?: string
  permissions?: Permission[]
  description?: string
}

export class RoleService {
  // Create a new role
  async createRole(roleData: RoleInput): Promise<IRole> {
    const { name, permissions, description } = roleData

    const existingRole = await Role.findOne({ name })
    if (existingRole) {
      throw new ConflictError('Role name already exists')
    }

    const newRole = new Role({
      name,
      permissions,
      description
    })

    await newRole.save()

    return newRole
  }

  // Get all roles with user count information
  async getAllRoles(): Promise<RoleWithUserCount[]> {
    const roles = await Role.find()

    const rolesWithUserCount = await Promise.all(
      roles.map(async (role) => {
        const totalUsers = await User.countDocuments({ roles: { $in: [role._id] } })
        return {
          ...role.toObject(),
          totalUsers
        }
      })
    )
    return rolesWithUserCount
  }

  async getPublicRoles(): Promise<IRole[]> {
    const roles = await Role.find().select('-permissions -description -createdAt -updatedAt -__v')
    return roles
  }

  // Get role by ID
  async getRoleById(roleId: string): Promise<IRole | RoleWithUserCount | null> {
    const role = await Role.findById(roleId)

    if (!role) {
      throw new NotFoundError('Role not found')
    }

    const totalUsers = await User.countDocuments({ roles: { $in: [role._id] } })

    return {
      ...role.toObject(),
      totalUsers
    }
  }

  // Update role
  async updateRole(roleId: string, updateData: UpdateRoleInput): Promise<IRole> {
    const role = await Role.findById(roleId)
    if (!role) {
      throw new NotFoundError('Role not found')
    }

    const { name, permissions, description } = updateData

    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ name })
      if (existingRole) {
        throw new ConflictError('Role name already exists')
      }
    }

    if (name) role.name = name
    if (permissions) role.permissions = permissions
    if (description !== undefined) role.description = description

    await role.save()

    return role
  }

  // Delete role with dependency checking
  async deleteRole(roleId: string): Promise<void> {
    const role = await Role.findById(roleId)
    if (!role) {
      throw new NotFoundError('Role not found')
    }

    const usersWithRole = await User.countDocuments({ roles: { $in: [role._id] } })
    if (usersWithRole > 0) {
      throw new ConflictError('Cannot delete role. It is assigned to users')
    }

    await Role.findByIdAndDelete(roleId)
  }

  // Get all permissions for a role
  async getAllPermissions(roleId: string): Promise<Permission[]> {
    const role = await Role.findById(roleId)
    if (!role) {
      throw new NotFoundError('Role not found')
    }

    return this.mergePermissions(role.permissions)
  }

  // Get user permissions across all assigned roles
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const user = await User.findById(userId).populate('roles')
    if (!user || !user.roles || user.roles.length === 0) {
      return []
    }

    // Collect permissions from all user roles
    const allPermissions = new Set<Permission>()

    for (const role of user.roles as unknown as Array<{ _id: string }>) {
      const rolePermissions = await this.getAllPermissions(role._id.toString())
      rolePermissions.forEach((permission) => allPermissions.add(permission))
    }

    return Array.from(allPermissions)
  }

  // Merge permission arrays and remove duplicates
  private mergePermissions(...permissionArrays: Permission[][]): Permission[] {
    const allPermissions = permissionArrays.flat()
    return [...new Set(allPermissions)]
  }
}
