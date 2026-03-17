import { Request, Response } from 'express'
import { ValidationError } from '~/utils/errors'
import type {
  AddReactionInput,
  CreateCommentInput,
  GetCommentReactionsQuery,
  GetCommentRepliesQuery,
  GetCommentsQuery,
  GetLessonCommentsQuery,
  GetUserCommentsQuery,
  ModerateCommentInput,
  RemoveReactionInput,
  UpdateCommentInput
} from '../schemas/comment.schema'
import { CommentService } from '../services/comment.service'
import { sendSuccess } from '../utils/success'

export class CommentController {
  /**
   * Create a new comment
   */
  static async createComment(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId

    if (!userId) {
      throw new ValidationError('ID người dùng là bắt buộc')
    }

    const commentData: CreateCommentInput = req.body

    const comment = await CommentService.createComment(userId, commentData)

    sendSuccess.created(res, 'Comment được tạo thành công', comment)
  }

  /**
   * Get comment by ID
   */
  static async getCommentById(req: Request, res: Response): Promise<void> {
    const { id } = req.params

    const comment = await CommentService.getCommentById(id)

    sendSuccess.ok(res, 'Comment được lấy thành công', { comment })
  }

  /**
   * Get comments for a specific lesson
   */
  static async getLessonComments(req: Request, res: Response): Promise<void> {
    const { lessonId } = req.params
    const query = req.query as unknown as GetLessonCommentsQuery

    const result = await CommentService.getLessonComments(lessonId, query)

    sendSuccess.ok(res, 'Lesson comments được lấy thành công', result)
  }

  /**
   * Get user's comments
   */
  static async getUserComments(req: Request, res: Response): Promise<void> {
    const { userId } = req.params
    const query = req.query as unknown as GetUserCommentsQuery

    const result = await CommentService.getUserComments(userId, query)

    sendSuccess.ok(res, 'User comments được lấy thành công', result)
  }

  /**
   * Get current user's comments
   */
  static async getMyComments(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId
    if (!userId) {
      res.status(401).json({ success: false, message: 'Không có quyền truy cập' })
      return
    }

    const query = req.query as unknown as GetUserCommentsQuery

    const result = await CommentService.getUserComments(userId, query)

    sendSuccess.ok(res, 'Your comments được lấy thành công', result)
  }

  /**
   * Get all comments (admin only)
   */
  static async getComments(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as GetCommentsQuery

    const result = await CommentService.getComments(query)

    sendSuccess.ok(res, 'Comments được lấy thành công', result)
  }

  /**
   * Update comment
   */
  static async updateComment(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const userId = req.user?.userId
    if (!userId) {
      res.status(401).json({ success: false, message: 'Không có quyền truy cập' })
      return
    }

    const updateData: UpdateCommentInput = req.body

    const comment = await CommentService.updateComment(id, userId, updateData)

    sendSuccess.ok(res, 'Comment được cập nhật thành công', comment)
  }

  /**
   * Delete comment
   */
  static async deleteComment(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const userId = req.user?.userId

    if (!userId) {
      throw new ValidationError('ID người dùng là bắt buộc')
    }

    const { deleteReplies } = req.query

    await CommentService.deleteComment(id, userId, deleteReplies === 'true')

    const message = deleteReplies === 'true' ? 'Comment and replies được xóa thành công' : 'Comment được xóa thành công'

    sendSuccess.ok(res, message)
  }

  /**
   * Get comment replies
   */
  static async getCommentReplies(req: Request, res: Response): Promise<void> {
    const { commentId } = req.params
    const query = req.query as unknown as GetCommentRepliesQuery

    const result = await CommentService.getCommentReplies(commentId, query)

    sendSuccess.ok(res, 'Comment replies được lấy thành công', result)
  }

  /**
   * Toggle reaction on comment (add if not exists, remove if exists)
   */
  static async addReaction(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const userId = req.user?.userId

    if (!userId) {
      throw new ValidationError('ID người dùng là bắt buộc')
    }

    const reactionData: AddReactionInput = req.body

    const comment = await CommentService.toggleReaction(id, userId, reactionData)

    sendSuccess.ok(res, 'Phản ứng đã được chuyển đổi thành công', comment)
  }

  /**
   * Remove reaction from comment
   */
  static async removeReaction(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const userId = req.user?.userId

    if (!userId) {
      throw new ValidationError('ID người dùng là bắt buộc')
    }

    const reactionData: RemoveReactionInput = req.body

    const comment = await CommentService.removeReaction(id, userId, reactionData)

    sendSuccess.ok(res, 'Reaction được xóa thành công', { comment })
  }

  /**
   * Update comment status (admin only)
   */
  static async updateCommentStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { status } = req.body

    const comment = await CommentService.updateCommentStatus(id, status)

    sendSuccess.ok(res, `Bình luận đã được ${status} thành công`, comment)
  }

  /**
   * Get comment reactions
   */
  static async getCommentReactions(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const query = req.query as unknown as GetCommentReactionsQuery

    const result = await CommentService.getCommentReactions(id, query)

    sendSuccess.ok(res, 'Comment reactions được lấy thành công', result)
  }
}
