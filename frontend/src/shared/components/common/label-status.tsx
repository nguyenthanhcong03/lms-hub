import { Chip, ChipProps } from "@heroui/react";

export interface LabelStatusProps extends ChipProps {
  children: React.ReactNode;
}

export function LabelStatus({ color, children, ...props }: LabelStatusProps) {
  return (
    <Chip
      color={color}
      variant="flat"
      radius="full"
      size="md"
      classNames={{
        content: "text-xs cursor-pointer font-bold !capitalize",
      }}
      {...props}
    >
      {children}
    </Chip>
  );
}
