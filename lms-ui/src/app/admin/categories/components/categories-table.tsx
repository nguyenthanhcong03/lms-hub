import { DataTable, DataTablePagination } from '@/components/table'
import { PAGINATION_CONSTANTS, SortOrder, TABLE_CONSTANTS } from '@/constants'
import { useCategories } from '@/hooks/use-categories'
import { useDebounce } from '@/hooks/use-debounce'
import { VisibilityState, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useCallback, useEffect, useMemo, useState } from 'react'
import CategoriesBulkDeleteDialog from './categories-bulk-delete-dialog'
import { columns } from './categories-columns'
import DataTableToolbar from './data-table-toolbar'

// Kiểu trạng thái bộ lọc để tổ chức rõ ràng hơn
interface FilterState {
  search: string
  status: string[]
  sortBy: string
  sortOrder: SortOrder
}

const CategoriesTable = () => {
  // Trạng thái cốt lõi của bảng
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(PAGINATION_CONSTANTS.DEFAULT_PAGE)
  const [pageSize, setPageSize] = useState(PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE)

  // Trạng thái bộ lọc - gom nhóm để tối ưu hiệu năng
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: [],
    sortBy: TABLE_CONSTANTS.DEFAULT_SORT_BY,
    sortOrder: TABLE_CONSTANTS.DEFAULT_SORT_ORDER
  })

  // Debounce ô tìm kiếm
  const debouncedSearch = useDebounce(filters.search, TABLE_CONSTANTS.SEARCH_DEBOUNCE_MS)

  // Tối ưu tham số truy vấn
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch,
      status: filters.status,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    }),
    [currentPage, pageSize, debouncedSearch, filters.status, filters.sortBy, filters.sortOrder]
  )

  const { data: categoriesData, isLoading } = useCategories(queryParams)

  // Trả về trang đầu khi bộ lọc thay đổi (tối ưu dependencies)
  useEffect(() => {
    setCurrentPage(PAGINATION_CONSTANTS.DEFAULT_PAGE)
  }, [debouncedSearch, filters.status, filters.sortBy, filters.sortOrder])

  // Memoized handlers để cải thiện hiệu năng
  const handleSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }, [])

  const handleStatusFilterChange = useCallback((status: string[]) => {
    setFilters((prev) => ({ ...prev, status }))
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      status: [],
      sortBy: TABLE_CONSTANTS.DEFAULT_SORT_BY,
      sortOrder: TABLE_CONSTANTS.DEFAULT_SORT_ORDER
    })
    setCurrentPage(PAGINATION_CONSTANTS.DEFAULT_PAGE)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setCurrentPage(PAGINATION_CONSTANTS.DEFAULT_PAGE) // Trả về trang đầu khi thay đổi kích thước trang
  }, [])

  const handleBulkDelete = useCallback(() => {
    setBulkDeleteDialogOpen(true)
  }, [])

  const handleBulkDeleteSuccess = useCallback(() => {
    setRowSelection({}) // Xóa vùng chọn sau khi xóa thành công
  }, [])

  // Dữ liệu danh mục đã được memo hóa
  const categories = useMemo(() => categoriesData?.categories || [], [categoriesData?.categories])

  // Lấy danh sách danh mục đã chọn cho thao tác hàng loạt
  const selectedCategories = useMemo(() => {
    return categories.filter((_, index) => rowSelection[index])
  }, [categories, rowSelection])

  // Cấu hình bảng đã được memo hóa
  const table = useReactTable({
    data: categories,
    columns,
    state: {
      columnVisibility,
      rowSelection
    },
    enableRowSelection: TABLE_CONSTANTS.ENABLE_ROW_SELECTION,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className='space-y-4'>
      <DataTableToolbar
        searchValue={filters.search}
        statusFilter={filters.status}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        onClearFilters={handleClearFilters}
        onBulkDelete={handleBulkDelete}
        isLoading={isLoading}
        table={table}
      />

      <div className='overflow-hidden rounded-xs border'>
        <DataTable table={table} />
      </div>

      {categoriesData?.pagination && (
        <DataTablePagination
          pagination={categoriesData.pagination}
          currentDataLength={categories.length}
          pageSize={pageSize}
          pageSizeOptions={PAGINATION_CONSTANTS.PAGE_SIZE_OPTIONS}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Hộp thoại xóa hàng loạt */}
      <CategoriesBulkDeleteDialog
        selectedCategories={selectedCategories}
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onSuccess={handleBulkDeleteSuccess}
      />
    </div>
  )
}

export default CategoriesTable
