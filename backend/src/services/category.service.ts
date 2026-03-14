import { FilterQuery } from 'mongoose'
import { BadRequestError } from '~/core/error.response'
import CategoryModel from '~/models/category.model'
import { CategoryQueryParams, CreateCategoryParams } from '~/types/category.type'

const CategoriesService = {
  createCategory: async (userId: string, body: CreateCategoryParams) => {
    const existCategory = await CategoryModel.findOne({ slug: body.slug })

    if (existCategory) {
      throw new BadRequestError('Danh mục đã tồn tại')
    }

    return CategoryModel.create({
      ...body,
      created_by: userId
    })
  },

  getCategory: async (id: string) => {
    const category = await CategoryModel.findById(id)

    if (!category) {
      throw new BadRequestError('Danh mục không tồn tại')
    }

    return category
  },

  updateCategory: async (id: string, body: Partial<CreateCategoryParams>) => {
    return CategoryModel.findByIdAndUpdate(id, body, { new: true, runValidators: true })
  },

  getAllCategories: async (params: CategoryQueryParams) => {
    const limit = +(params?.limit ?? 10)
    const search = params?.search || ''
    const page = +(params?.page ?? 1)

    const query: FilterQuery<typeof CategoryModel> = {}

    if (search) {
      query.$or = [{ name: { $regex: search, $options: 'i' } }]
    }

    const skip = (page - 1) * limit

    if (page === -1 && limit === -1) {
      const result = await CategoryModel.find(query)
        .sort({ createdAt: -1 })
        .populate('created_by', 'username email avatar')

      return { result }
    }

    const [categories, total_count] = await Promise.all([
      CategoryModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('created_by', 'username email avatar'),
      CategoryModel.countDocuments(query)
    ])

    return {
      categories,
      pagination: {
        page,
        per_page: limit,
        total_pages: Math.ceil(total_count / limit),
        total_count
      }
    }
  },

  deleteCategory: async (id: string) => {
    const result = await CategoryModel.findByIdAndDelete(id)
    if (!result) {
      throw new BadRequestError('Danh mục không tồn tại')
    }
    return result
  },

  deleteManyCategories: async (ids: string[]) => {
    const result = await CategoryModel.deleteMany({ _id: { $in: ids } })

    if (result.deletedCount === 0) {
      throw new BadRequestError('Không có danh mục nào được tìm thấy')
    }

    return result
  }
}

export default CategoriesService


