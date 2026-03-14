"use client";
import InputNumberField from "@/shared/components/form/input-number-field";
import { useFilters } from "@/shared/contexts/filter-context";
import { Button } from "@heroui/react";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";

const PriceFilter = () => {
  const { filters, updateFilters } = useFilters();

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [isPending, startTransition] = useTransition();

  const handleApplyPrice = () => {
    const min_price = minPrice.replace(/,/g, "");
    const max_price = maxPrice.replace(/,/g, "");

    if (!min_price) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
    } else if (min_price && max_price && +min_price > +max_price) {
      toast.error("Giá tối thiểu phải nhỏ hơn giá tối đa");
    } else {
      startTransition(() => {
        updateFilters({
          min_price,
          max_price,
        });
      });
    }
  };

  useEffect(() => {
    setMinPrice(filters.min_price);
    setMaxPrice(filters.max_price);
  }, [filters.min_price, filters.max_price]);

  return (
    <div className="space-y-4">
      <div>Khoảng giá</div>
      <div className="flex items-center gap-2">
        <InputNumberField
          placeholder="₫ TỪ"
          className="text-xs"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <span>-</span>
        <InputNumberField
          placeholder="₫ ĐẾN"
          className="text-xs"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      <Button
        radius="sm"
        className="w-full"
        color="primary"
        onPress={handleApplyPrice}
      >
        Áp dụng
      </Button>
    </div>
  );
};

export default PriceFilter;
