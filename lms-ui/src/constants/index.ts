// Tái xuất tất cả hằng số từ các file riêng lẻ
export * from './table'
export * from './pagination'
export * from './filters'

// Có thể tạo các nhóm export nếu cần
export { TABLE_CONSTANTS } from './table'
export { PAGINATION_CONSTANTS } from './pagination'
export { FILTER_OPTIONS } from './filters'

export const DEFAULT_AVATAR = '/images/default-avatar.jpg'
export const DEFAULT_THUMBNAIL = '/images/default-thumbnail.jpg'
