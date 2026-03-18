import { Router } from 'express'
import upload from '~/middlewares/upload.middleware'
import { UploadController } from '../controllers/upload.controller'
import { asyncHandler } from '../middlewares/error.middleware'

const router = Router()

router.get('/images', asyncHandler(UploadController.getUploadedImages))
router.post('/', upload.single('file'), asyncHandler(UploadController.uploadImage))
router.post('/multiple', upload.array('files', 10), asyncHandler(UploadController.uploadMultipleImages))
router.delete('/', asyncHandler(UploadController.deleteImage))

export default router
