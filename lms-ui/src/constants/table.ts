// Hằng số cấu hình bảng
export const TABLE_CONSTANTS = {
  // Sắp xếp mặc định
  DEFAULT_SORT_BY: 'createdAt',
  DEFAULT_SORT_ORDER: 'desc' as const,

  // Tìm kiếm và lọc
  SEARCH_DEBOUNCE_MS: 500,

  // Chọn dữ liệu
  ENABLE_ROW_SELECTION: true,
  ENABLE_COLUMN_VISIBILITY: true
}

// Kiểu thứ tự sắp xếp để đảm bảo an toàn kiểu tốt hơn
export type SortOrder = typeof TABLE_CONSTANTS.DEFAULT_SORT_ORDER | 'asc'
