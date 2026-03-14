import express from 'express'
import ReactionController from '~/controllers/reaction.controller'
import { isAuthenticated } from '~/middlewares/auth.middleware'
import { CatchAsyncError } from '~/middlewares/catch-async-errors.middleware'

const router = express.Router()

router.post('/', isAuthenticated, CatchAsyncError(ReactionController.toggleReaction))
router.get('/', isAuthenticated, CatchAsyncError(ReactionController.fetchAllReactions))
router.get('/:id', isAuthenticated, CatchAsyncError(ReactionController.fetchReactionById))
router.put('/:id', isAuthenticated, CatchAsyncError(ReactionController.updateReactionDetails))
router.delete('/:id', isAuthenticated, CatchAsyncError(ReactionController.deleteReactionById))

export default router
