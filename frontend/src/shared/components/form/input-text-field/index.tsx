import { cn } from "@/utils/common";
import { Input, InputProps } from "@heroui/react";

interface InputTextFieldProps extends Partial<InputProps> {
  isRequired?: boolean;
}
const InputTextField = ({
  label = "",
  isRequired = false,
  classNames = {
    inputWrapper: "",
    label: "",
    base: "",
    input: "",
  },
  ...rests
}: InputTextFieldProps) => {
  return (
    <div>
      {label && (
        <label htmlFor="" className="mb-1.5 inline-block text-sm font-semibold">
          {isRequired ? (
            <>
              {label} <span className="text-red-500">*</span>
            </>
          ) : (
            <>{label}</>
          )}
        </label>
      )}
      <Input
        labelPlacement="outside"
        {...rests}
        variant="bordered"
        classNames={{
          base: "!mt-0",
          inputWrapper: cn(
            " h-10 w-full rounded-md  border  bg-white px-3 text-sm font-medium outline-none transition-all focus-within:!border-primary data-[hover=true]:!border-primary",
            classNames.inputWrapper,
          ),
          input: `${rests.disabled ? "cursor-not-allowed" : ""} `,
          label: "font-semibold text-sm",
        }}
      />
    </div>
  );
};

export default InputTextField;
