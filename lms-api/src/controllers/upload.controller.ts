import { Request, Response } from 'express'
import { deleteImage, listImages, uploadImage } from '../utils/cloudinary'
import { ValidationError } from '../utils/errors'
import { sendSuccess } from '../utils/success'

interface CloudinaryUploadResult {
  secure_url?: string
  url?: string
  public_id?: string
  publicId?: string
}

interface UploadResponse {
  url: string
  publicId: string
}

const getFolder = (folder?: string): string => {
  const normalizedFolder = folder?.trim()
  return normalizedFolder ? normalizedFolder : 'uploads'
}

const normalizeUploadResult = (result: CloudinaryUploadResult): UploadResponse => {
  const url = result.secure_url ?? result.url
  const publicId = result.public_id ?? result.publicId

  if (!url || !publicId) {
    throw new ValidationError('Không nhận được dữ liệu upload hợp lệ từ Cloudinary')
  }

  return { url, publicId }
}

export class UploadController {
  static async getUploadedImages(req: Request, res: Response): Promise<void> {
    const folder = req.query.folder as string | undefined
    const nextCursor = req.query.nextCursor as string | undefined
    const limitParam = req.query.limit as string | undefined
    const parsedLimit = limitParam ? Number(limitParam) : 8

    if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
      throw new ValidationError('limit phải là số nguyên dương')
    }

    const result = await listImages({
      folder,
      nextCursor,
      limit: parsedLimit
    })

    sendSuccess.ok(res, 'Lấy danh sách ảnh thành công', result)
  }

  static async uploadImage(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      throw new ValidationError('Vui lòng chọn file để upload')
    }

    if (!req.file.mimetype.startsWith('image/')) {
      throw new ValidationError('Chỉ chấp nhận file ảnh')
    }

    const folder = getFolder(req.body.folder as string | undefined)
    const uploadResult = (await uploadImage(req.file.buffer, folder)) as CloudinaryUploadResult
    const result = normalizeUploadResult(uploadResult)

    sendSuccess.ok(res, 'Upload ảnh thành công', result)
  }

  static async uploadMultipleImages(req: Request, res: Response): Promise<void> {
    if (!Array.isArray(req.files) || req.files.length === 0) {
      throw new ValidationError('Vui lòng chọn ít nhất một file để upload')
    }

    const invalidFiles = req.files.filter((file) => !file.mimetype.startsWith('image/'))
    if (invalidFiles.length > 0) {
      throw new ValidationError('Chỉ chấp nhận file ảnh')
    }

    const folder = getFolder(req.body.folder as string | undefined)
    const uploadPromises = req.files.map((file) => uploadImage(file.buffer, folder))
    const uploadResults = await Promise.all(uploadPromises)
    const results = uploadResults.map((result) => normalizeUploadResult(result as CloudinaryUploadResult))

    sendSuccess.ok(res, `Upload ${results.length} ảnh thành công`, { images: results })
  }

  static async deleteImage(req: Request, res: Response): Promise<void> {
    const { publicId } = req.body as { publicId?: string }

    if (!publicId) {
      throw new ValidationError('Vui lòng cung cấp publicId')
    }

    await deleteImage(publicId)

    sendSuccess.ok(res, 'Xóa ảnh thành công')
  }
}
