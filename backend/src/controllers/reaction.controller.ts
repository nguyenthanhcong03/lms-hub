import { Request, Response } from 'express'
import { OK } from '~/core/success.response'
import ReactionService from '~/services/reaction.service'

const ReactionController = {
  toggleReaction: async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const result = await ReactionService.toggleReaction(userId, req.body)
    return new OK({
      message: result ? 'Reaction toggled successfully' : 'Reaction removed successfully',
      data: result
    }).send(res)
  },

  fetchAllReactions: async (req: Request, res: Response) => {
    const result = await ReactionService.fetchAllReactions(req.query)

    return new OK({
      message: 'Reactions retrieved successfully',
      data: result
    }).send(res)
  },

  fetchReactionById: async (req: Request, res: Response) => {
    const { id: reactionId } = req.params
    const result = await ReactionService.fetchReactionById(reactionId)
    return new OK({
      message: 'Reaction retrieved successfully',
      data: result
    }).send(res)
  },

  updateReactionDetails: async (req: Request, res: Response) => {
    const { id: reactionId } = req.params
    const result = await ReactionService.updateReaction(reactionId, req.body)
    return new OK({
      message: 'Reaction updated successfully',
      data: result
    }).send(res)
  },

  deleteReactionById: async (req: Request, res: Response) => {
    const { id: reactionId } = req.params
    const result = await ReactionService.deleteReactionById(reactionId)
    return new OK({
      message: 'Reaction deleted successfully',
      data: result
    }).send(res)
  }
}

export default ReactionController
