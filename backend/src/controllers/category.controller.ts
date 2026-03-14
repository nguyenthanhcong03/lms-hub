import { Request, Response } from 'express'
import { BadRequestError } from '~/core/error.response'
import { OK } from '~/core/success.response'
import CategoriesService from '~/services/category.service'

const CategoryController = {
  createCategory: async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const result = await CategoriesService.createCategory(userId, req.body)
    return new OK({
      message: 'Create category successfully',
      data: result
    }).send(res)
  },

  getCategory: async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await CategoriesService.getCategory(id)
    return new OK({
      message: 'Get category successfully',
      data: result
    }).send(res)
  },

  updateCategory: async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await CategoriesService.updateCategory(id, req.body)
    return new OK({
      message: 'Update category successfully',
      data: result
    }).send(res)
  },

  deleteCategory: async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await CategoriesService.deleteCategory(id)

    return new OK({
      message: 'Delete category successfully',
      data: result
    }).send(res)
  },

  deleteManyCategories: async (req: Request, res: Response) => {
    const ids = req.body.categoryIds

    if (!ids || ids.length === 0) {
      throw new BadRequestError('Product type ids are required')
    }

    const result = await CategoriesService.deleteManyCategories(ids)
    return new OK({
      message: 'Delete many category successfully',
      data: result
    }).send(res)
  },

  getAllCategories: async (req: Request, res: Response) => {
    const params = req.query

    const result = await CategoriesService.getAllCategories(params)
    return new OK({
      message: 'Get all categories successfully',
      data: result
    }).send(res)
  }
}

export default CategoryController
