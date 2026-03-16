import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteUser } from "@/hooks/use-users";
import { IUser } from "@/types/user";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import UsersActionDialog from "./users-action-dialog";
import UsersDeleteDialog from "./users-delete-dialog";

interface DataTableRowActionsProps {
  row: Row<IUser>;
}

const DataTableRowActions = ({ row }: DataTableRowActionsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const deleteUserMutation = useDeleteUser();

  const user = row.original;

  const handleDelete = async () => {
    await deleteUserMutation.mutateAsync(user._id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Mở menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              setEditDialogOpen(true);
            }}
          >
            Chỉnh sửa
            <DropdownMenuShortcut>
              <IconEdit size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-red-500!">
            Xóa
            <DropdownMenuShortcut>
              <IconTrash size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UsersActionDialog user={user} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
      <UsersDeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} currentRow={user} />
    </>
  );
};

export default DataTableRowActions;
