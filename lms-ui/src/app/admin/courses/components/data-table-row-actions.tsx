"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PERMISSIONS } from "@/configs/permission";
import { useAuthStore } from "@/stores/auth-store";
import { ICourse } from "@/types/course";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { IconEdit, IconList, IconTrash } from "@tabler/icons-react";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CoursesActionDialog from "./courses-action-dialog";
import CoursesDeleteDialog from "./courses-delete-dialog";

interface DataTableRowActionsProps {
  row: Row<ICourse>;
}

const DataTableRowActions = ({ row }: DataTableRowActionsProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const hasPermission = useAuthStore((state) => state.hasPermission);

  const course = row.original;

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleOutlineClick = () => {
    router.push(`/admin/courses/${course._id}/outline`);
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Má»Ÿ menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {hasPermission(PERMISSIONS.COURSE_CREATE) && (
            <DropdownMenuItem onClick={handleOutlineClick}>
              Nội dung
              <DropdownMenuShortcut>
                <IconList size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          {hasPermission(PERMISSIONS.COURSE_UPDATE) && (
            <DropdownMenuItem onClick={handleEditClick}>
              Chỉnh sửa
              <DropdownMenuShortcut>
                <IconEdit size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          {(hasPermission(PERMISSIONS.COURSE_UPDATE) || hasPermission(PERMISSIONS.COURSE_DELETE)) && (
            <DropdownMenuSeparator />
          )}
          {hasPermission(PERMISSIONS.COURSE_DELETE) && (
            <DropdownMenuItem onClick={handleDeleteClick} className="text-red-500!">
              Xóa
              <DropdownMenuShortcut>
                <IconTrash size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hộp thoại chỉnh sửa - Chỉ hiển thị khi có quyền UPDATE và đang mở */}
      {hasPermission(PERMISSIONS.COURSE_UPDATE) && editDialogOpen && (
        <CoursesActionDialog mode="edit" course={course} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
      )}

      {/* Hộp thoại xóa - Chỉ hiển thị khi có quyền DELETE và đang mở */}
      {hasPermission(PERMISSIONS.COURSE_DELETE) && deleteDialogOpen && (
        <CoursesDeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} currentRow={course} />
      )}
    </>
  );
};

export default DataTableRowActions;
