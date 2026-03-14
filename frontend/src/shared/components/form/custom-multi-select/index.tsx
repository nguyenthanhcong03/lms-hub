import React from "react";
import { AsyncPaginate, AsyncPaginateProps } from "react-select-async-paginate";
interface OptionType {
  label: string;
  value: string;
}

interface CustomMultiSelectProps
  extends AsyncPaginateProps<OptionType, any, any, any> {
  label?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  label,
  isRequired = false,
  isInvalid,
  errorMessage,
  placeholder = "--- Chọn ---",
  isMulti = true,
  isClearable = true,
  ...rests
}) => {
  return (
    <div>
      {label && (
        <label htmlFor="" className="mb-1.5 inline-block text-sm font-bold">
          {isRequired ? (
            <>
              {label} <span className="text-red-500">*</span>
            </>
          ) : (
            <>{label}</>
          )}
        </label>
      )}
      <AsyncPaginate
        isMulti={isMulti}
        isClearable={isClearable}
        placeholder={placeholder}
        menuPosition="fixed"
        debounceTimeout={500}
        isSearchable={true}
        additional={{
          page: 1,
        }}
        {...rests}
      />
      {isInvalid && (
        <p className="mt-1.5 text-xs text-pink-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default CustomMultiSelect;
