"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { IconEdit, IconTrash, IconList } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePermissions } from "@/hooks/use-permissions";
import { RESOURCES, OPERATIONS } from "@/configs/permission";
import { ICourse } from "@/types/course";
import CoursesActionDialog from "./courses-action-dialog";
import CoursesDeleteDialog from "./courses-delete-dialog";

interface DataTableRowActionsProps {
  row: Row<ICourse>;
}

const DataTableRowActions = ({ row }: DataTableRowActionsProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const { UPDATE, DELETE } = usePermissions(RESOURCES.COURSE, [OPERATIONS.UPDATE, OPERATIONS.DELETE]);

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
          {UPDATE && (
            <DropdownMenuItem onClick={handleOutlineClick}>
              Ná»™i dung
              <DropdownMenuShortcut>
                <IconList size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          {UPDATE && (
            <DropdownMenuItem onClick={handleEditClick}>
              Chá»‰nh sá»­a
              <DropdownMenuShortcut>
                <IconEdit size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          {(UPDATE || DELETE) && <DropdownMenuSeparator />}
          {DELETE && (
            <DropdownMenuItem onClick={handleDeleteClick} className="text-red-500!">
              XÃ³a
              <DropdownMenuShortcut>
                <IconTrash size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hộp thoại chỉnh sửa - Chỉ hiển thị khi có quyền UPDATE và đang mở */}
      {UPDATE && editDialogOpen && (
        <CoursesActionDialog mode="edit" course={course} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
      )}

      {/* Hộp thoại xóa - Chỉ hiển thị khi có quyền DELETE và đang mở */}
      {DELETE && deleteDialogOpen && (
        <CoursesDeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} currentRow={course} />
      )}
    </>
  );
};

export default DataTableRowActions;
