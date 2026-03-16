"use client";

import { DataTable, DataTablePagination } from "@/components/table";
import { useCourses } from "@/hooks/use-courses";
import { useDebounce } from "@/hooks/use-debounce";
import { VisibilityState, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { columns } from "./courses-columns";
import DataTableToolbar from "./data-table-toolbar";
import CoursesBulkDeleteDialog from "./courses-bulk-delete-dialog";
import { TABLE_CONSTANTS, PAGINATION_CONSTANTS, SortOrder } from "@/constants";

interface FilterState {
  search: string;
  status: string[];
  type: string[];
  level: string[];
  sortBy: string;
  sortOrder: SortOrder;
}

const CoursesTable = () => {
  // Trạng thái bảng
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(PAGINATION_CONSTANTS.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE);

  // Trạng thái bộ lọc
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: [],
    type: [],
    level: [],
    sortBy: TABLE_CONSTANTS.DEFAULT_SORT_BY,
    sortOrder: TABLE_CONSTANTS.DEFAULT_SORT_ORDER,
  });

  // Giảm tần suất cập nhật ô tìm kiếm
  const debouncedSearch = useDebounce(filters.search, TABLE_CONSTANTS.SEARCH_DEBOUNCE_MS);

  // Tham số truy vấn đã tối ưu
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch,
      status: filters.status,
      type: filters.type,
      level: filters.level,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    }),
    [
      currentPage,
      pageSize,
      debouncedSearch,
      filters.status,
      filters.type,
      filters.level,
      filters.sortBy,
      filters.sortOrder,
    ],
  );

  const { data: coursesData, isLoading } = useCourses(queryParams);

  // Reset vá» trang Ä‘áº§u tiÃªn khi cÃ¡c filter thay Ä‘á»•i
  useEffect(() => {
    setCurrentPage(PAGINATION_CONSTANTS.DEFAULT_PAGE);
  }, [debouncedSearch, filters.status, filters.type, filters.level, filters.sortBy, filters.sortOrder]);

  // Ghi nhớ các hàm xử lý để tối ưu hiệu năng
  const handleSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const handleStatusFilterChange = useCallback((status: string[]) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const handleTypeFilterChange = useCallback((type: string[]) => {
    setFilters((prev) => ({ ...prev, type }));
  }, []);

  const handleLevelFilterChange = useCallback((level: string[]) => {
    setFilters((prev) => ({ ...prev, level }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: "",
      status: [],
      type: [],
      level: [],
      sortBy: TABLE_CONSTANTS.DEFAULT_SORT_BY,
      sortOrder: TABLE_CONSTANTS.DEFAULT_SORT_ORDER,
    });
    setCurrentPage(PAGINATION_CONSTANTS.DEFAULT_PAGE);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(PAGINATION_CONSTANTS.DEFAULT_PAGE);
  }, []);

  const handleBulkDelete = useCallback(() => {
    setBulkDeleteDialogOpen(true);
  }, []);

  const handleBulkDeleteSuccess = useCallback(() => {
    setRowSelection({});
  }, []);

  // Dữ liệu khóa học đã được ghi nhớ
  const courses = useMemo(() => coursesData?.courses || [], [coursesData?.courses]);

  // Lấy các khóa học đã chọn để thao tác hàng loạt
  const selectedCourses = useMemo(() => {
    return courses.filter((_, index) => rowSelection[index]);
  }, [courses, rowSelection]);

  // Cấu hình bảng đã được ghi nhớ
  const table = useReactTable({
    data: courses,
    columns,
    state: {
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: TABLE_CONSTANTS.ENABLE_ROW_SELECTION,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        searchValue={filters.search}
        statusFilter={filters.status}
        typeFilter={filters.type}
        levelFilter={filters.level}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        onTypeFilterChange={handleTypeFilterChange}
        onLevelFilterChange={handleLevelFilterChange}
        onClearFilters={handleClearFilters}
        onBulkDelete={handleBulkDelete}
        isLoading={isLoading}
        table={table}
      />

      <div className="overflow-hidden rounded-xs border">
        <DataTable table={table} />
      </div>

      {coursesData?.pagination && (
        <DataTablePagination
          pagination={coursesData.pagination}
          currentDataLength={courses.length}
          pageSize={pageSize}
          pageSizeOptions={PAGINATION_CONSTANTS.PAGE_SIZE_OPTIONS}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Hộp thoại xóa hàng loạt */}
      <CoursesBulkDeleteDialog
        selectedCourses={selectedCourses}
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onSuccess={handleBulkDeleteSuccess}
      />
    </div>
  );
};

export default CoursesTable;
