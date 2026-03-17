// Hằng số cấu hình phân trang
export const PAGINATION_CONSTANTS = {
  // Kích thước trang mặc định
  DEFAULT_PAGE_SIZE: 10,

  // Các tùy chọn kích thước trang
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],

  // Trang bắt đầu mặc định
  DEFAULT_PAGE: 1,

  // Giới hạn phân trang
  MIN_PAGE_SIZE: 5,
  MAX_PAGE_SIZE: 100
}

// Kiểu cho tùy chọn kích thước trang
export type PageSizeOption = (typeof PAGINATION_CONSTANTS.PAGE_SIZE_OPTIONS)[number]
