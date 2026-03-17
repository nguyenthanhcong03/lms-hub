import { Blog, IBlog } from '../models/blog'
import { Category } from '../models/category'
import { User } from '../models/user'
import { AppError } from '../utils/errors'
import { CreateBlogInput, UpdateBlogInput, GetBlogsQuery, BulkDeleteBlogsInput } from '../schemas/blog.schema'
import { Types } from 'mongoose'

/**
 * Dịch vụ quản lý bài viết
 * Các thao tác tạo, đọc, cập nhật, xóa cho bài viết
 */

interface GetBlogsResult {
  blogs: IBlog[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export class BlogService {
  /**
   * Tạo bài viết mới
   */
  static async createBlog(blogData: CreateBlogInput, authorId: string): Promise<IBlog> {
    // Kiểm tra slug đã tồn tại chưa
    const existingBlog = await Blog.findOne({ slug: blogData.slug })
    if (existingBlog) {
      throw new AppError('Đã tồn tại bài viết với slug này', 400)
    }

    // Kiểm tra tác giả có tồn tại
    const author = await User.findById(authorId)
    if (!author) {
      throw new AppError('Không tìm thấy tác giả', 404)
    }

    // Kiểm tra danh mục có tồn tại (nếu có truyền)
    if (blogData.categoryId) {
      const category = await Category.findById(blogData.categoryId)
      if (!category) {
        throw new AppError('Không tìm thấy danh mục', 400)
      }
    }

    const blog = new Blog({
      ...blogData,
      authorId
    })

    await blog.save()
    return blog
  }

  /**
   * Lấy danh sách bài viết có phân trang và lọc
   */
  static async getBlogs(options: Partial<GetBlogsQuery> = {}): Promise<GetBlogsResult> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      authorId,
      categoryId,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = options
    // Chuyển chuỗi sang số bằng toán tử +
    const pageNum = +page
    const limitNum = +limit
    const skip = (pageNum - 1) * limitNum

    // Tạo điều kiện lọc
    const filter: Record<string, unknown> = {}

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ]
    }

    if (status) {
      if (Array.isArray(status)) {
        filter.status = { $in: status }
      } else if (typeof status === 'string' && status.includes(',')) {
        const statusArray = status.split(',').map((s) => s.trim())
        filter.status = { $in: statusArray }
      } else {
        filter.status = status
      }
    }

    if (authorId) {
      filter.authorId = authorId
    }

    if (categoryId) {
      filter.categoryId = categoryId
    }

    // Tạo điều kiện sắp xếp
    const sort: Record<string, 1 | -1> = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    // Thực thi truy vấn song song
    const [blogsResult, total] = await Promise.all([
      Blog.aggregate([
        { $match: filter },
        { $sort: sort },
        { $skip: skip },
        { $limit: limitNum },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
            pipeline: [{ $project: { name: 1, email: 1 } }]
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
            pipeline: [{ $project: { name: 1, slug: 1 } }]
          }
        },
        {
          $addFields: {
            author: { $arrayElemAt: ['$author', 0] },
            category: { $arrayElemAt: ['$category', 0] }
          }
        },
        {
          $unset: ['authorId', 'categoryId']
        }
      ]),
      Blog.countDocuments(filter)
    ])

    const blogs = blogsResult as IBlog[]

    const totalPages = Math.ceil(total / limitNum)

    return {
      blogs: blogs as IBlog[],
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    }
  }

  /**
   * Lấy bài viết theo ID
   */
  static async getBlogById(blogId: string): Promise<IBlog> {
    const blogResult = await Blog.aggregate([
      { $match: { _id: new Types.ObjectId(blogId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author',
          pipeline: [{ $project: { name: 1, email: 1 } }]
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
          pipeline: [{ $project: { name: 1, slug: 1 } }]
        }
      },
      {
        $addFields: {
          author: { $arrayElemAt: ['$author', 0] },
          category: { $arrayElemAt: ['$category', 0] }
        }
      },
      {
        $unset: ['authorId', 'categoryId']
      }
    ])

    const blog = blogResult[0] as IBlog

    if (!blog) {
      throw new AppError('Không tìm thấy bài viết', 404)
    }

    return blog
  }

  /**
   * Lấy bài viết theo slug
   */
  static async getBlogBySlug(slug: string): Promise<IBlog> {
    const blogResult = await Blog.aggregate([
      { $match: { slug: slug } },
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author',
          pipeline: [{ $project: { username: 1, avatar: 1 } }]
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
          pipeline: [{ $project: { name: 1, slug: 1 } }]
        }
      },
      {
        $addFields: {
          author: { $arrayElemAt: ['$author', 0] },
          category: { $arrayElemAt: ['$category', 0] }
        }
      },
      {
        $unset: ['authorId', 'categoryId']
      }
    ])

    const blog = blogResult[0] as IBlog

    if (!blog) {
      throw new AppError('Không tìm thấy bài viết', 404)
    }

    return blog
  }

  /**
   * Cập nhật bài viết
   */
  static async updateBlog(blogId: string, updateData: UpdateBlogInput, authorId?: string): Promise<IBlog> {
    const blog = await Blog.findById(blogId)
    if (!blog) {
      throw new AppError('Không tìm thấy bài viết', 404)
    }

    // Kiểm tra quyền sở hữu (nếu có authorId - cho người dùng không phải admin)
    if (authorId && blog.authorId.toString() !== authorId) {
      throw new AppError('Bạn không có quyền cập nhật bài viết này', 403)
    }

    // Kiểm tra slug mới có bị trùng không
    if (updateData.slug && updateData.slug !== blog.slug) {
      const existingBlog = await Blog.findOne({ slug: updateData.slug })
      if (existingBlog) {
        throw new AppError('Đã tồn tại bài viết với slug này', 400)
      }
    }

    // Kiểm tra danh mục có tồn tại (nếu có truyền)
    if (updateData.categoryId) {
      const category = await Category.findById(updateData.categoryId)
      if (!category) {
        throw new AppError('Không tìm thấy danh mục', 400)
      }
    }

    // Cập nhật bài viết
    Object.assign(blog, updateData)
    await blog.save()

    const updatedBlogResult = await Blog.aggregate([
      { $match: { _id: new Types.ObjectId(blogId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author',
          pipeline: [{ $project: { name: 1, email: 1 } }]
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
          pipeline: [{ $project: { name: 1, slug: 1 } }]
        }
      },
      {
        $addFields: {
          author: { $arrayElemAt: ['$author', 0] },
          category: { $arrayElemAt: ['$category', 0] }
        }
      },
      {
        $unset: ['authorId', 'categoryId']
      }
    ])

    return updatedBlogResult[0] as IBlog
  }

  /**
   * Xóa bài viết
   */
  static async deleteBlog(blogId: string, authorId?: string): Promise<void> {
    const blog = await Blog.findById(blogId)
    if (!blog) {
      throw new AppError('Không tìm thấy bài viết', 404)
    }

    // Kiểm tra quyền sở hữu (nếu có authorId - cho người dùng không phải admin)
    if (authorId && blog.authorId.toString() !== authorId) {
      throw new AppError('Bạn không có quyền xóa bài viết này', 403)
    }

    await Blog.findByIdAndDelete(blogId)
  }

  /**
   * Xóa hàng loạt bài viết
   */
  static async bulkDeleteBlogs(
    data: BulkDeleteBlogsInput,
    authorId?: string
  ): Promise<{
    deletedCount: number
    skippedBlogs: { id: string; title: string; reason: string }[]
  }> {
    const { blogIds } = data

    // Loại bỏ phần tử trùng lặp
    const uniqueBlogIds = [...new Set(blogIds)]

    // Kiểm tra tất cả bài viết có tồn tại
    const blogs = await Blog.find({ _id: { $in: uniqueBlogIds } })
    const foundBlogIds = blogs.map((blog) => blog._id.toString())
    const notFoundIds = uniqueBlogIds.filter((id) => !foundBlogIds.includes(id))

    if (notFoundIds.length > 0) {
      throw new AppError(`Không tìm thấy bài viết: ${notFoundIds.join(', ')}`, 404)
    }

    let deletedCount = 0
    const skippedBlogs: { id: string; title: string; reason: string }[] = []

    // Kiểm tra quyền sở hữu cho từng bài viết (nếu có authorId)
    if (authorId) {
      for (const blog of blogs) {
        if (blog.authorId.toString() !== authorId) {
          skippedBlogs.push({
            id: blog._id.toString(),
            title: blog.title,
            reason: 'Bạn không có quyền xóa bài viết này'
          })
        }
      }

      // Chỉ xóa các bài viết thuộc quyền sở hữu của người dùng
      const ownedBlogIds = blogs.filter((blog) => blog.authorId.toString() === authorId).map((blog) => blog._id)

      const result = await Blog.deleteMany({ _id: { $in: ownedBlogIds } })
      deletedCount = result.deletedCount || 0
    } else {
      // Admin có thể xóa tất cả bài viết
      const result = await Blog.deleteMany({ _id: { $in: uniqueBlogIds } })
      deletedCount = result.deletedCount || 0
    }

    return {
      deletedCount,
      skippedBlogs
    }
  }

  /**
   * Chỉ lấy bài viết đã xuất bản (điểm cuối công khai)
   */
  static async getPublishedBlogs(options: Partial<GetBlogsQuery> = {}): Promise<GetBlogsResult> {
    const { page = 1, limit = 10, search } = options
    // Chuyển chuỗi sang số bằng toán tử +
    const pageNum = +page
    const limitNum = +limit
    const skip = (pageNum - 1) * limitNum

    // Tạo điều kiện lọc cho bài viết đã xuất bản
    const filter: Record<string, unknown> = {
      status: 'published',
      publishedAt: { $lte: new Date() } // Chỉ hiển thị bài viết đã xuất bản trước hoặc bằng ngày hiện tại
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ]
    }

    // Thực thi truy vấn song song
    const [blogsResult, total] = await Promise.all([
      Blog.aggregate([
        { $match: filter },
        { $skip: skip },
        { $limit: limitNum },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
            pipeline: [{ $project: { username: 1, avatar: 1 } }]
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
            pipeline: [{ $project: { name: 1, slug: 1 } }]
          }
        },
        {
          $addFields: {
            author: { $arrayElemAt: ['$author', 0] },
            category: { $arrayElemAt: ['$category', 0] }
          }
        },
        {
          $unset: ['authorId', 'categoryId']
        }
      ]),
      Blog.countDocuments(filter)
    ])

    const blogs = blogsResult as IBlog[]

    const totalPages = Math.ceil(total / limitNum)

    return {
      blogs: blogs as IBlog[],
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    }
  }

  /**
   * Lấy các bài viết của chính người dùng
   */
  static async getUserBlogs(authorId: string, options: Partial<GetBlogsQuery> = {}): Promise<GetBlogsResult> {
    return this.getBlogs({
      ...options,
      authorId
    })
  }
}
