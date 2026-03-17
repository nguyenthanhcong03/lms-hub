import { DataTable, DataTablePagination } from '@/components/table'
import { PAGINATION_CONSTANTS, TABLE_CONSTANTS } from '@/constants'
import { useAllComments } from '@/hooks/use-comments'
import { useDebounce } from '@/hooks/use-debounce'
import { getCoreRowModel, useReactTable, VisibilityState } from '@tanstack/react-table'
import { useCallback, useEffect, useMemo, useState } from 'react'
import CommentsBulkDeleteDialog from './comments-bulk-delete-dialog'
import { commentsColumns } from './comments-columns'
import DataTableToolbar from './data-table-toolbar'

// Kiểu trạng thái bộ lọc để tổ chức rõ ràng hơn
interface FilterState {
  search: string
  status: string[]
}

const CommentsTable = () => {
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
    status: []
  })

  // Debounce ô tìm kiếm
  const debouncedSearch = useDebounce(filters.search, TABLE_CONSTANTS.SEARCH_DEBOUNCE_MS)

  // Tối ưu tham số truy vấn
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch,
      status: filters.status
    }),
    [currentPage, pageSize, debouncedSearch, filters.status]
  )

  const { data: commentsData, isLoading } = useAllComments(queryParams)

  // Trả về trang đầu khi bộ lọc thay đổi (tối ưu dependencies)
  useEffect(() => {
    setCurrentPage(PAGINATION_CONSTANTS.DEFAULT_PAGE)
  }, [debouncedSearch, filters.status])

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
      status: []
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

  // Dữ liệu bình luận đã được memo hóa
  const comments = useMemo(() => commentsData?.comments || [], [commentsData?.comments])

  // Lấy danh sách bình luận đã chọn cho thao tác hàng loạt
  const selectedComments = useMemo(() => {
    return comments.filter((_, index) => rowSelection[index])
  }, [comments, rowSelection])

  // Cấu hình bảng đã được memo hóa
  const table = useReactTable({
    data: comments,
    columns: commentsColumns,
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

      <div className='overflow-hidden rounded-md border'>
        <div className='overflow-x-auto'>
          <DataTable table={table} />
        </div>
      </div>

      {commentsData?.pagination && (
        <DataTablePagination
          pagination={commentsData.pagination}
          currentDataLength={comments.length}
          pageSize={pageSize}
          pageSizeOptions={PAGINATION_CONSTANTS.PAGE_SIZE_OPTIONS}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Hộp thoại xóa hàng loạt */}
      <CommentsBulkDeleteDialog
        selectedComments={selectedComments}
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onSuccess={handleBulkDeleteSuccess}
      />
    </div>
  )
}

export default CommentsTable
