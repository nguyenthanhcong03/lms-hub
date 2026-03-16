"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { IUser, UserStatus, UserType } from "@/types/user";
import { IRole } from "@/types/role";
import { DataTableColumnHeader } from "@/components/table";
import DataTableRowActions from "./data-table-row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getStatusConfig } from "@/utils/common";

const getUserTypeBadgeVariant = (userType: UserType) => {
  switch (userType) {
    case "facebook":
      return "outline";
    case "google":
      return "outline";
    case "default":
      return "secondary";
    default:
      return "secondary";
  }
};

export const usersColumns: ColumnDef<IUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Chọn tất cả"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Chọn dòng"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    meta: { title: "Người dùng" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Người dùng" />,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{user.username}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    meta: { title: "Trạng thái" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as UserStatus;
      const config = getStatusConfig(status);

      return (
        <Badge
          className={`rounded-full capitalize border ${config.bgColor} ${config.textColor} ${config.borderColor} ${config.ringColor} focus-visible:outline-none`}
        >
          <span className={`size-1.5 rounded-full ${config.dotColor}`} aria-hidden="true" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "userType",
    meta: { title: "Loại người dùng" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Loại người dùng" />,
    cell: ({ row }) => {
      const userType = row.getValue("userType") as UserType;
      return <Badge variant={getUserTypeBadgeVariant(userType)}>{userType}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "courses",
    meta: { title: "Khóa học" },

    header: ({ column }) => <DataTableColumnHeader column={column} title="Khóa học" />,
    cell: ({ row }) => {
      const courses = row.getValue("courses") as string[];
      return (
        <div className="flex space-x-2">
          <span className="max-w-[100px] truncate">{courses?.length || 0} khóa học</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "roles",
    meta: { title: "Vai trò" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Vai trò" />,
    cell: ({ row }) => {
      const roles = row.getValue("roles") as IRole[];
      return (
        <div className="flex flex-wrap gap-1">
          {roles?.slice(0, 2).map((role, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {role.name}
            </Badge>
          ))}
          {roles?.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{roles.length - 2} vai trò khác
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    meta: { title: "Ngày tạo" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="flex space-x-2">
          <span className="max-w-[150px] truncate">{date.toLocaleDateString()}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
