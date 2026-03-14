import { cn, Textarea, TextAreaProps } from "@heroui/react";

interface TextareaFieldProps extends Partial<TextAreaProps> {
  isRequired?: boolean;
}
const TextareaField = ({
  className,
  label,
  isRequired,
  ...rests
}: TextareaFieldProps) => {
  return (
    <Textarea
      labelPlacement="outside"
      variant="bordered"
      {...rests}
      label={
        isRequired ? (
          <>
            {label} <span className="text-red-500">*</span>
          </>
        ) : (
          <>{label}</>
        )
      }
      classNames={{
        inputWrapper: cn(
          "w-full rounded-md border px-3 text-sm font-medium outline-none transition-all focus-within:!border-primary  hover:!border-primary",
          className,
        ),
        label: " text-black text-sm font-semibold",
      }}
    />
  );
};

export default TextareaField;
