"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, {
  createContext,
  useContext,
  useOptimistic,
  useTransition,
} from "react";
import * as yup from "yup";

const filterSchema = yup.object().shape({
  level: yup.array().of(yup.string()).default([]).optional(),
  q: yup.string().default("").optional(),
  category: yup.string().default("").optional(),
  sort_by: yup.string().default("ctime").optional(),
  order: yup.string().default("").optional(),
  min_star: yup.string().optional(),
  min_price: yup.string().default("").optional(),
  max_price: yup.string().default("").optional(),
  page: yup.string().optional(),
});

type Filters = yup.InferType<typeof filterSchema>;
type FilterContextType = {
  filters: Filters;
  isPending: boolean;
  updateFilters: (_updates: Partial<Filters>) => void;
};

export const FilterContext = createContext<FilterContextType | undefined>(
  undefined,
);

export default function FilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse filters using yup schema
  const filters = filterSchema.cast({
    level: searchParams.getAll("level"),
    q: searchParams.get("q") || undefined,
    category: searchParams.get("category") || undefined,
    sort_by: searchParams.get("sort_by") || undefined,
    order: searchParams.get("order") || undefined,
    min_star: searchParams.get("min_star") || undefined,
    min_price: searchParams.get("min_price") || undefined,
    max_price: searchParams.get("max_price") || undefined,
    page: searchParams.get("page") || undefined,
  });

  const [isPending, startTransition] = useTransition();
  const [optimisticFilters, setOptimisticFilters] = useOptimistic(
    filters,
    (prevState, newFilters: Partial<Filters>) => {
      return {
        ...prevState,
        ...newFilters,
      };
    },
  );

  function updateFilters(updates: Partial<typeof optimisticFilters>) {
    const newState = {
      ...optimisticFilters,
      ...updates,
    };
    const newSearchParams = new URLSearchParams();

    Object.entries(newState).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          newSearchParams.append(key, v || "");
        });
      } else if (!!value) {
        newSearchParams.set(key, value);
      }
    });

    startTransition(() => {
      setOptimisticFilters(updates || {});
      router.push(`?${newSearchParams}`, { scroll: false });
    });
  }

  return (
    <FilterContext.Provider
      value={{ filters: optimisticFilters || {}, isPending, updateFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}
