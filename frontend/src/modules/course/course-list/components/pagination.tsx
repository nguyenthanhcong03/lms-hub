"use client";

import { useFilters } from "@/shared/contexts/filter-context";
import React from "react";
import { useTransition } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import ReactPaginate from "react-paginate";

const Pagination = ({ total_pages }: { total_pages: number }) => {
  const { filters, updateFilters } = useFilters();

  const [isPending, startTransition] = useTransition();
  return (
    <ReactPaginate
      containerClassName={"pagination"}
      activeClassName={"active"}
      pageClassName={"page-item"}
      onPageChange={(event) => {
        startTransition(() => {
          updateFilters({
            page: (event.selected + 1).toString(),
          });
        });
      }}
      breakLabel="..."
      pageCount={total_pages || 0}
      previousLabel={<FaAngleLeft />}
      nextLabel={<FaAngleRight />}
      forcePage={Number(filters?.page || 1) - 1}
    />
  );
};

export default Pagination;
