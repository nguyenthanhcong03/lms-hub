import { cn } from "@/utils/common";
import React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
interface InputNumberFieldProps extends NumericFormatProps {
  label?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
}
const InputNumberField = ({
  label,
  className,
  thousandSeparator = true,
  isRequired = false,
  isInvalid = false,
  errorMessage = "",
  ...rests
}: InputNumberFieldProps) => {
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

      <NumericFormat
        thousandSeparator={thousandSeparator}
        allowLeadingZeros
        className={cn(
          `focus-primary dark:border/10 flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm font-medium outline-none transition-all hover:border-primary focus:!border-primary dark:bg-grayDarker ${isInvalid ? "border-pink-600" : ""}`,
          className,
        )}
        {...rests}
      />
      {isInvalid && (
        <p className="mt-1.5 text-xs text-pink-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputNumberField;
