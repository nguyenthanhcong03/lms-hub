"use client";
import { useFilters } from "@/shared/contexts/filter-context";
import { Button } from "@heroui/react";
import React from "react";

const BtnResetFilter = () => {
  const { updateFilters } = useFilters();
  const handleReset = () => {
    updateFilters({
      category: "",
      level: [],
      min_star: undefined,
      min_price: "",
      max_price: "",
      page: "1",
    });
  };

  return (
    <Button
      onPress={handleReset}
      radius="sm"
      className="w-full"
      color="primary"
    >
      Xóa tất cả
    </Button>
  );
};

export default BtnResetFilter;
