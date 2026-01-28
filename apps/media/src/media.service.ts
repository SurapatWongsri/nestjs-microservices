import { Injectable } from '@nestjs/common'
import { initCloudinary } from './cloudinary/cloudinary.client'
import { Media, MediaDocument } from './media/media.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { rpcBadRequest } from '@app/rpc'

@Injectable()
export class MediaService {
  private readonly cloudinary = initCloudinary()

  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>,
  ) {}

  async uploadProductImage(input: {
    fileName: string
    mimeType: string
    base64: string
    uploadByUserId: string
  }) {
    this.validateUploadInput(input)

    const buffer = Buffer.from(input.base64, 'base64')
    if (!buffer.length) rpcBadRequest('Invalid Image data')

    const { url, publicId } = await this.uploadToCloudinary(buffer)

    const mediaDoc = await this.mediaModel.create({
      url,
      publicId,
      uploadByUserId: input.uploadByUserId,
    })

    return {
      mediaId: String(mediaDoc._id),
      url,
      publicId,
    }
  }

  async attachToProduct(input: { mediaId: string; productId: string }) {
    const updated = await this.mediaModel
      .findByIdAndUpdate(
        input.mediaId,
        { $set: { productId: input.productId } },
        { new: true },
      )
      .exec()

    if (!updated) {
      rpcBadRequest('Media not found')
    }

    return {
      mediaId: String(updated._id),
      productId: String(updated.productId),
      url: updated.url,
      publicId: updated.publicId,
    }
  }

  ping() {
    return {
      ok: true,
      service: 'media',
      now: new Date().toISOString(),
    }
  }

  // -------- private --------

  private validateUploadInput(input: {
    fileName: string
    mimeType: string
    base64: string
    uploadByUserId: string
  }) {
    if (!input.base64) rpcBadRequest('Image base64 is required')
    if (!input.fileName) rpcBadRequest('Image file name is required')
    if (!input.uploadByUserId)
      rpcBadRequest('Image upload by user id is required')
    if (!input.mimeType.startsWith('image/'))
      rpcBadRequest('Image mime type is invalid')
  }

  private async uploadToCloudinary(buffer: Buffer) {
    return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        { folder: 'nestjs-microservices/products', resource_type: 'image' },
        (err, result) => {
          if (err) return reject(new Error(JSON.stringify(err)))
          if (!result?.secure_url || !result?.public_id) {
            return reject(new Error('Cloudinary upload failed'))
          }
          resolve({ url: result.secure_url, publicId: result.public_id })
        },
      )
      stream.end(buffer)
    })
  }
}
