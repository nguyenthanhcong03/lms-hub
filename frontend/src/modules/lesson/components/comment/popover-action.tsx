import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";

interface PopoverActionProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
}

const PopoverAction: React.FC<PopoverActionProps> = ({
  isOpen,
  setIsOpen,
  trigger,
  children,
}) => {
  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      placement="bottom-end"
      classNames={{
        base: " w-[200px] ",
      }}
    >
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent>{children}</PopoverContent>
    </Popover>
  );
};

export default PopoverAction;
