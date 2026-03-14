import express from 'express'
import TrackController from '~/controllers/track.controller'
import { isAuthenticated } from '~/middlewares/auth.middleware'
import { CatchAsyncError } from '~/middlewares/catch-async-errors.middleware'

const router = express.Router()

router.post('/', isAuthenticated, CatchAsyncError(TrackController.createOrToggleTrack))
router.get('/', isAuthenticated, CatchAsyncError(TrackController.getUserTracksByCourse))

export default router
