import { v2 as cloudinary } from 'cloudinary'

export const initCloudinary = () => {
  const cloundName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloundName || !apiKey || !apiSecret) {
    throw new Error('Missing Cloudinary credentials')
  }

  cloudinary.config({
    cloud_name: cloundName,
    api_key: apiKey,
    api_secret: apiSecret,
  })

  return cloudinary
}
