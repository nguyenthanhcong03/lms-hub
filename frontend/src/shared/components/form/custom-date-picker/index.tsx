import { cn } from "@/utils/common";
import { DatePicker, DatePickerProps } from "@heroui/react";
interface CustomDatePickerProps extends Partial<DatePickerProps> {
  label?: string;
  isRequired?: boolean;
}

const CustomDatePicker = ({
  className = "",
  label = "",
  isRequired = false,
  ...rests
}: CustomDatePickerProps) => {
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
      <DatePicker
        labelPlacement="outside"
        variant="bordered"
        className={cn(
          "[&>[data-slot='input-wrapper']]:!rounded-md [&>[data-slot='input-wrapper']]:!border [&>[data-slot='input-wrapper']]:!bg-white [&>[data-slot='input-wrapper']]:focus-within:!border-primary [&>[data-slot='label']]:!font-semibold",
          className,
        )}
        {...rests}
      />
    </div>
  );
};

export default CustomDatePicker;
