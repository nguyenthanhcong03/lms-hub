// Role interfaces and types for the role management system

import { Permission } from "@/configs/permission";

// Import Permission type from components

// Base role interface
export interface IRole {
  _id: string;
  name: string;
  description: string;
  permissions: Permission[];
  totalUsers: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Form data interface for creating/updating roles
export interface RoleFormData {
  name: string;
  description: string;
  permissions: Permission[];
}

// Role creation request
export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions: Permission[];
}

// Role update request
export interface UpdateRoleRequest extends Partial<CreateRoleRequest> {
  id: string;
}

// Role permissions update request
export interface UpdateRolePermissionsRequest {
  id: string;
  permissions: Permission[];
}

// Filter and search parameters for roles
export interface RolesFilterParams {
  search?: string;
  hasPermissions?: boolean;
  sortBy?: keyof IRole;
  sortOrder?: "asc" | "desc";
  permissions?: Permission[]; // Filter by specific permissions
  [key: string]: unknown; // Index signature for additional properties
}
