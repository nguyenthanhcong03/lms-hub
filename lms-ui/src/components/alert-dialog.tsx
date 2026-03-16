import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { OctagonAlert } from "lucide-react";

interface AlertDialogDestructiveProps {
  handleConfirm: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled: boolean;
}

export default function AlertDialogDestructive({
  handleConfirm,
  open,
  onOpenChange,
  disabled,
}: AlertDialogDestructiveProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <AlertDialogTitle>
            <div className="mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <OctagonAlert className="h-7 w-7 text-destructive" />
            </div>
            Bạn có chắc chắn không?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px] text-center">
            Hành động này không thể hoàn tác. Tài khoản của bạn sẽ bị xóa vĩnh viễn và dữ liệu sẽ bị gỡ khỏi hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2 sm:justify-center">
          <AlertDialogCancel disabled={disabled}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            disabled={disabled}
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleConfirm}
          >
            Xác Nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
