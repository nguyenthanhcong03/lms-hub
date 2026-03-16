import { Cross2Icon } from "@radix-ui/react-icons";
import { IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter, DataTableViewOptions } from "@/components/table";
import { Table } from "@tanstack/react-table";
import { FILTER_OPTIONS } from "@/constants";

interface DataTableToolbarProps<TData> {
  searchValue: string;
  statusFilter: string[];
  typeFilter: string[];
  levelFilter: string[];
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (values: string[]) => void;
  onTypeFilterChange: (values: string[]) => void;
  onLevelFilterChange: (values: string[]) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
  table: Table<TData>;
  onBulkDelete?: () => void;
}

const DataTableToolbar = <TData,>({
  searchValue,
  statusFilter,
  typeFilter,
  levelFilter,
  onSearchChange,
  onStatusFilterChange,
  onTypeFilterChange,
  onLevelFilterChange,
  onClearFilters,
  isLoading = false,
  table,
  onBulkDelete,
}: DataTableToolbarProps<TData>) => {
  const isFiltered = searchValue !== "" || statusFilter.length > 0 || typeFilter.length > 0 || levelFilter.length > 0;

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelectedRows = selectedRows.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Tìm kiếm khóa học..."
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-62.5"
          disabled={isLoading}
        />
        <div className="flex gap-x-2">
          <DataTableFacetedFilter
            title="Trạng thái"
            options={FILTER_OPTIONS.COURSE_STATUS}
            selectedValues={statusFilter}
            onSelectionChange={onStatusFilterChange}
            disabled={isLoading}
          />
          <DataTableFacetedFilter
            title="Loại"
            options={FILTER_OPTIONS.COURSE_TYPE}
            selectedValues={typeFilter}
            onSelectionChange={onTypeFilterChange}
            disabled={isLoading}
          />
          <DataTableFacetedFilter
            title="Cấp độ"
            options={FILTER_OPTIONS.COURSE_LEVEL}
            selectedValues={levelFilter}
            onSelectionChange={onLevelFilterChange}
            disabled={isLoading}
          />
        </div>
        {isFiltered && (
          <Button variant="ghost" onClick={onClearFilters} className="h-8 px-2 lg:px-3" disabled={isLoading}>
            Xóa bộ lọc
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Nếu có hàng được chọn */}
        {hasSelectedRows && (
          <>
            <span className="text-sm text-muted-foreground">
              {selectedRows.length} trên {table.getFilteredRowModel().rows.length} hàng đã chọn
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkDelete}
              disabled={isLoading}
              className="text-destructive hover:text-destructive border-destructive/20 hover:border-destructive/30"
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Xóa {selectedRows.length} khóa học
            </Button>
          </>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
};

export default DataTableToolbar;
