import { FilterQuery, PipelineStage } from 'mongoose'
import CommentModel from '~/models/comment.model'
import { CreateCommentParams, TParamsGetComments } from '~/types/comment.type'

import { CommentStatus } from '~/constants/enums'
import { BadRequestError } from '~/core/error.response'
import { toObjectId } from '~/utils'

const CommentService = {
  createComment: async (userId: string, commentData: CreateCommentParams) => {
    const payload = {
      ...commentData,
      lesson: commentData.lessonId,
      user: userId
    }
    const newComment = (await CommentModel.create(payload)).populate('user', 'username avatar')
    return newComment
  },

  getComment: async (commentId: string) => {
    const comment = await CommentModel.findById(commentId)

    if (!comment) {
      throw new BadRequestError('Bình luận không tồn tại')
    }

    return comment
  },

  updateComment: async (commentId: string, updateData: Partial<CreateCommentParams>) => {
    const updatedComment = await CommentModel.findByIdAndUpdate(commentId, updateData, {
      new: true,
      runValidators: true
    })
    if (!updatedComment) {
      throw new BadRequestError('Bình luận không tồn tại')
    }

    return updatedComment
  },

  changeCommentStatus: async (commentId: string, statusData: { userId: string; status: string }) => {
    const { status } = statusData
    const result = await CommentModel.findByIdAndUpdate(commentId, { status }, { new: true, runValidators: true })

    if (!result) {
      throw new BadRequestError('Bình luận không tồn tại')
    }

    return result
  },

  getAllComments: async (queryParams: TParamsGetComments) => {
    const limit = +(queryParams?.limit ?? 10)
    const search = queryParams?.search || ''
    const page = +(queryParams?.page ?? 1)
    const status = queryParams?.status || ''

    const query: FilterQuery<typeof CommentModel> = {}

    if (status) {
      query.status = status
    }

    if (search) {
      query.$or = [{ content: { $regex: search, $options: 'i' } }]
    }

    const skip = (page - 1) * limit

    const [comments, total_count] = await Promise.all([
      CommentModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('user', 'username avatar email'),
      CommentModel.countDocuments(query)
    ])
    const total_pages = Math.ceil(total_count / limit)
    return { comments, pagination: { page, per_page: limit, total_pages, total_count } }
  },

  getAllCommentsByLesson: async (queryParams: TParamsGetComments) => {
    const limit = +(queryParams?.limit ?? 10)
    const search = queryParams?.search || ''
    const page = +(queryParams?.page ?? 1)
    const skip = (page - 1) * limit
    const lessonId = queryParams?.lessonId || ''

    const query: FilterQuery<typeof CommentModel> = {
      parentId: null,
      lesson: toObjectId(lessonId),
      status: CommentStatus.APPROVED
    }

    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { 'user.username': { $regex: search, $options: 'i' } }
      ]
    }

    const pipeline = [
      { $match: query },

      {
        $graphLookup: {
          from: 'comments',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parentId',
          as: 'allReplies'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          content: 1,
          parentId: 1,
          createdAt: 1,
          'user._id': 1,
          'user.username': 1,
          'user.avatar': 1,
          replies_count: { $size: '$allReplies' }
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'reactions',
          localField: '_id',
          foreignField: 'comment',
          as: 'reactions',
          pipeline: [
            {
              $project: {
                _id: 1,
                type: 1,
                comment: 1,
                user: 1
              }
            }
          ]
        }
      },
      {
        $addFields: {
          replies: []
        }
      }
    ]

    const [comments, total_count] = await Promise.all([
      CommentModel.aggregate(pipeline as PipelineStage[]),
      CommentModel.countDocuments(query)
    ])

    const total_pages = Math.ceil(total_count / limit)

    return {
      comments,
      pagination: { page, perPage: limit, total_pages, total_count }
    }
  },

  getReplies: async (parentId: string) => {
    const replies = await CommentModel.aggregate([
      { $match: { parentId: toObjectId(parentId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1
              }
            }
          ]
        }
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'reactions',
          localField: '_id',

          foreignField: 'comment',
          as: 'reactions',
          pipeline: [
            {
              $project: {
                _id: 1,
                type: 1,
                comment: 1
              }
            }
          ]
        }
      },
      {
        $project: {
          content: 1,
          parentId: 1,
          createdAt: 1,
          user: 1,
          reactions: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ])

    return {
      parentId,
      replies
    }
  },

  deleteComment: async (commentId: string) => {
    const replies = await CommentModel.find({ parentId: commentId }).select('_id')
    const ids = replies.map((reply) => reply._id.toString())
    ids.push(commentId)
    await CommentModel.deleteMany({ _id: { $in: ids } })
    return { _id: commentId }
  },

  deleteMultipleComments: async (commentIds: string[]) => {
    return await CommentModel.deleteMany({ _id: { $in: commentIds } })
  }
}

export default CommentService
