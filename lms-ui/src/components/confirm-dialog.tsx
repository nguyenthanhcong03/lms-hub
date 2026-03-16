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

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  desc: React.JSX.Element | string;
  confirmText?: React.ReactNode;
  handleConfirm: () => void;
  disabled?: boolean;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const { desc, confirmText, handleConfirm, disabled = false, ...actions } = props;
  return (
    <AlertDialog {...actions}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
          <AlertDialogDescription>{desc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={disabled}>Hủy</AlertDialogCancel>
          <AlertDialogAction disabled={disabled} onClick={handleConfirm}>
            {confirmText ?? "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
