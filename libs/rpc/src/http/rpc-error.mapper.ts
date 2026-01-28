import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

export function mapRpcErrorToHttp(err: unknown): never {
  const errorObj = err as {
    error?: { code?: string; message?: string }
    code?: string
    message?: string
  }

  const payload = errorObj?.error ?? errorObj
  const code = payload?.code
  const message = payload?.message ?? 'Request failed!!!'

  switch (code) {
    case 'BAD_REQUEST':
    case 'VALIDATION_ERROR':
      throw new BadRequestException(message)

    case 'UNAUTHORIZED':
      throw new UnauthorizedException(message)

    case 'NOT_FOUND':
      throw new NotFoundException(message)

    case 'FORBIDDEN':
      throw new ForbiddenException(message)

    default:
      throw new InternalServerErrorException(message)
  }
}
