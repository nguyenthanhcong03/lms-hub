// Các interface và kiểu dữ liệu cho hệ thống quản lý vai trò

import { Permission } from '@/configs/permission'

// Import Permission type from components

// Cơ sở role interface
export interface IRole {
  _id: string
  name: string
  description: string
  permissions: Permission[]
  totalUsers: number
  createdAt: string
  updatedAt: string
  __v: number
}

// Interface dữ liệu form để tạo/cập nhật roles
export interface RoleFormData {
  name: string
  description: string
  permissions: Permission[]
}

// Role creation request
export interface CreateRoleRequest {
  name: string
  description: string
  permissions: Permission[]
}

// Yêu cầu cập nhật vai trò
export interface UpdateRoleRequest extends Partial<CreateRoleRequest> {
  id: string
}

// Yêu cầu cập nhật quyền vai trò
export interface UpdateRolePermissionsRequest {
  id: string
  permissions: Permission[]
}

// Tham số lọc và tìm kiếm cho vai trò
export interface RolesFilterParams {
  search?: string
  hasPermissions?: boolean
  sortBy?: keyof IRole
  sortOrder?: 'asc' | 'desc'
  permissions?: Permission[] // Filter by specific permissions
  [key: string]: unknown // Index signature for additional properties
}
