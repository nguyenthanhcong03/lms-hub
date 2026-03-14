import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { TiInfoOutline } from "react-icons/ti";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
}
const ConfirmationDialog = ({
  isOpen,
  onCancel,
  onConfirm,
  title,
}: ConfirmationDialogProps) => {
  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={onCancel}
      hideCloseButton
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <TiInfoOutline size={24} className="text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="font-bold uppercase">{title}</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn xóa dữ liệu của mình không? Tất cả
                        dữ liệu của bạn sẽ bị xóa vĩnh viễn. Hành động này không
                        thể hoàn tác.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="border-t-1">
              <Button
                type="button"
                className="bg-indigo-50 px-5 py-2.5 text-xs font-bold text-indigo-500 hover:bg-indigo-100 data-[hover=true]:!opacity-100"
                radius="full"
                onPress={onClose}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-600 data-[hover=true]:!opacity-100"
                radius="full"
                onPress={onConfirm}
              >
                Xác nhận
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationDialog;
