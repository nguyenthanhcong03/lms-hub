import { Pagination } from "@heroui/react";
import React from "react";

type BottomPaginationProps = {
  page: number;
  total_pages: number;
  startIndex: number;
  endIndex: number;
  total_count: number;
  onChangePage: (page: number) => void;
};

const BottomPagination = ({
  page,
  total_pages,
  startIndex,
  endIndex,
  total_count,
  onChangePage,
}: BottomPaginationProps) => {
  return (
    <div className="flex items-center justify-between px-2 py-2">
      <p className="text-sm font-medium text-gray-500">
        {total_pages
          ? `Showing ${startIndex} to ${endIndex} of ${total_count} entries`
          : ""}
      </p>
      <Pagination
        showControls
        color="primary"
        page={page}
        total={total_pages}
        variant="light"
        onChange={(page: number) => {
          onChangePage(page);
        }}
      />
    </div>
  );
};

export default BottomPagination;
