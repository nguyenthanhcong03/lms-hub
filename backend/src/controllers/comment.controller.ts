import { Request, Response } from 'express'
import { BadRequestError } from '~/core/error.response'
import { OK } from '~/core/success.response'
import CommentService from '~/services/comment.service'

const CommentController = {
  createComment: async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const result = await CommentService.createComment(userId, req.body)
    return new OK({
      message: 'Comment created successfully',
      data: result
    }).send(res)
  },

  getComment: async (req: Request, res: Response) => {
    const { id: commentId } = req.params
    const result = await CommentService.getComment(commentId)
    return new OK({
      message: 'Comment retrieved successfully',
      data: result
    }).send(res)
  },

  updateComment: async (req: Request, res: Response) => {
    const { id: commentId } = req.params
    const result = await CommentService.updateComment(commentId, req.body)
    return new OK({
      message: 'Comment updated successfully',
      data: result
    }).send(res)
  },

  changeCommentStatus: async (req: Request, res: Response) => {
    const { id: commentId } = req.params
    const result = await CommentService.changeCommentStatus(commentId, req.body)
    return new OK({
      message: 'Comment status updated successfully',
      data: result
    }).send(res)
  },

  deleteComment: async (req: Request, res: Response) => {
    const { id: commentId } = req.params
    const result = await CommentService.deleteComment(commentId)
    return new OK({
      message: 'Comment deleted successfully',
      data: result
    }).send(res)
  },

  deleteMultipleComments: async (req: Request, res: Response) => {
    const commentIds = req.body.commentIds

    if (!commentIds || commentIds.length === 0) {
      throw new BadRequestError('Comment IDs are required')
    }

    const result = await CommentService.deleteMultipleComments(commentIds)

    return new OK({
      message: 'Multiple comments deleted successfully',
      data: result
    }).send(res)
  },

  getAllComments: async (req: Request, res: Response) => {
    const queryParams = req.query

    const result = await CommentService.getAllComments(queryParams)

    return new OK({
      message: 'All comments retrieved successfully',
      data: result
    }).send(res)
  },

  getAllCommentsByLesson: async (req: Request, res: Response) => {
    const queryParams = req.query

    const result = await CommentService.getAllCommentsByLesson(queryParams)

    return new OK({
      message: 'Comments for the lesson retrieved successfully',
      data: result
    }).send(res)
  },

  getReplies: async (req: Request, res: Response) => {
    const { parentId } = req.query

    const result = await CommentService.getReplies(parentId as string)

    return new OK({
      message: 'Replies retrieved successfully',
      data: result
    }).send(res)
  }
}

export default CommentController
