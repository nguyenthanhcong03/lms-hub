"use client";
import InputTextField from "@/shared/components/form/input-text-field";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
const InputSearch = ({
  onSearchValue,
}: {
  onSearchValue: (value: string) => void;
}) => {
  const [filterValue, setFilterValue] = useState("");

  // use debounce

  const debouncedFilterValue = useDebounce(filterValue);

  useEffect(() => {
    onSearchValue(debouncedFilterValue);
  }, [debouncedFilterValue]);

  return (
    <InputTextField
      isClearable
      placeholder="Tìm kiếm ..."
      className="h-10"
      size="sm"
      type="search"
      startContent={<IoSearch size={20} />}
      value={filterValue}
      variant="bordered"
      onClear={() => setFilterValue("")}
      onValueChange={setFilterValue}
    />
  );
};

export default InputSearch;
