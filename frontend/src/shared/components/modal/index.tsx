import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@heroui/react";

interface ModalNextUIProps extends Partial<ModalProps> {
  children: React.ReactNode;
  isSubmitting?: boolean;
  btnSubmitText?: string;
  isHeader?: boolean;
  isFooter?: boolean;
  footer?: React.ReactNode;
}

const ModalNextUI = ({
  onSubmit,
  children,
  isSubmitting,
  size = "xl",
  title = "",
  btnSubmitText = "Thêm mới",
  isHeader = true,
  isFooter = true,
  footer = null,
  ...props
}: ModalNextUIProps) => {
  return (
    <Modal
      size={size}
      placement="top-center"
      scrollBehavior="inside"
      isDismissable={false}
      {...props}
      classNames={{
        wrapper: "",
        body: `py-6 bg-white  rounded-xl shadow-lg `,
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "border-gray-200  dark:bg-[#19172c] text-black ",
        header: "border-b-[1px] border-gray-200 bg-white rounded-t-xl",
        footer: "border-t-[1px] border-gray-200 bg-white rounded-b-xl",
        closeButton: "hover:bg-gray-500/5 active:bg-white/10",
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <form className="w-full" onSubmit={onSubmit}>
        <ModalContent>
          {(onClose) => (
            <>
              {isHeader && (
                <ModalHeader className="flex flex-col gap-1 border-b py-3 uppercase">
                  {title}
                </ModalHeader>
              )}
              <ModalBody>{children}</ModalBody>
              {footer && footer}
              {isFooter && (
                <ModalFooter className="border-t">
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
                    isDisabled={isSubmitting}
                    isLoading={isSubmitting}
                  >
                    {btnSubmitText}
                  </Button>
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </form>
    </Modal>
  );
};

export default ModalNextUI;
