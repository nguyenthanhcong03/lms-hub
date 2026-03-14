import React from "react";
import { IoIosAddCircle } from "react-icons/io";

type DynamicFieldArrayProps = {
  label: string;
  onAdd: () => void;
  className?: string;
  children: React.ReactNode;
};

const DynamicFieldArray = ({
  label,
  onAdd,
  className,
  children,
}: DynamicFieldArrayProps) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-5 pb-2 text-sm font-semibold">
        <label>{label}</label>
        <button
          className="inline-block text-primary"
          type="button"
          onClick={onAdd}
        >
          <IoIosAddCircle size={20} />
        </button>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
};

export default DynamicFieldArray;
