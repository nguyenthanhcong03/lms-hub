import ReactionModel from '~/models/reaction.model'

import { BadRequestError } from '~/core/error.response'
import { CreateReactionParams, ReactionQueryParams } from '~/types/reaction.type'

const ReactionService = {
  toggleReaction: async (userId: string, reactionData: CreateReactionParams) => {
    const { type, commentId } = reactionData

    const existingReaction = await ReactionModel.findOne({ user: userId, comment: commentId }).select('type').lean()

    if (existingReaction) {
      if (existingReaction.type === type) {
        await ReactionModel.deleteOne({ user: userId, comment: commentId })
        return null // Reaction removed
      } else {
        const updatedReaction = await ReactionModel.findOneAndUpdate(
          { user: userId, comment: commentId },
          { type },
          { new: true, projection: 'comment type user' }
        ).lean()

        return updatedReaction
      }
    }

    const newReaction = await ReactionModel.create({
      type,
      comment: commentId,
      user: userId
    })

    return {
      _id: newReaction._id,
      type: newReaction.type,
      comment: newReaction.comment,
      user: newReaction.user
    }
  },

  fetchReactionById: async (reactionId: string) => {
    const reaction = await ReactionModel.findById(reactionId)

    if (!reaction) {
      throw new BadRequestError('Reaction not found')
    }

    return reaction
  },

  updateReaction: async (reactionId: string, updateData: Partial<CreateReactionParams>) => {
    const updatedReaction = await ReactionModel.findByIdAndUpdate(reactionId, updateData, {
      new: true,
      runValidators: true
    })

    return updatedReaction
  },

  fetchAllReactions: async (queryParams: ReactionQueryParams) => {
    const { commentId, type } = queryParams

    const reactions = await ReactionModel.find({
      ...(commentId && { comment: commentId }),
      ...(type && { type })
    })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })

    return reactions
  },

  deleteReactionById: async (reactionId: string) => {
    const deletedReaction = await ReactionModel.findByIdAndDelete(reactionId)

    if (!deletedReaction) {
      throw new BadRequestError('Reaction not found')
    }

    return deletedReaction
  },

  deleteMultipleReactions: async (reactionIds: string[]) => {
    return await ReactionModel.deleteMany({ _id: { $in: reactionIds } })
  }
}

export default ReactionService
