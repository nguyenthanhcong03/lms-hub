"use client";

import { courseLevelActions } from "@/shared/constants/course.constant";
import { useFilters } from "@/shared/contexts/filter-context";
import { Checkbox, CheckboxGroup } from "@heroui/react";
import { useTransition } from "react";

const LevelFilter = () => {
  const { filters, updateFilters } = useFilters();
  const levels = filters.level || [];

  const [isPending, startTransition] = useTransition();
  return (
    <CheckboxGroup
      className="space-y-2"
      color="primary"
      label="Mức độ"
      classNames={{
        label: "text-sm text-black",
      }}
      value={levels.filter((level): level is string => level !== undefined)}
      onValueChange={(newLevels) => {
        startTransition(() => {
          updateFilters({
            level: newLevels,
          });
        });
      }}
    >
      {courseLevelActions.map((item, index) => (
        <Checkbox className="py-2.5" size="sm" key={index} value={item.value}>
          {item.label}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
};

export default LevelFilter;
