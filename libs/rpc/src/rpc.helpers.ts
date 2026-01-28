import { RpcException } from '@nestjs/microservices'
import { RpcErrorPayload } from './rpc.types'

export function rpcBadRequest(
  message: string,
  details?: Record<string, unknown>,
): never {
  const payload: RpcErrorPayload = { code: 'BAD_REQUEST', message, details }
  throw new RpcException(payload)
}

export function rpcValidationError(
  message: string,
  details?: Record<string, unknown>,
): never {
  const payload: RpcErrorPayload = {
    code: 'VALIDATION_ERROR',
    message,
    details,
  }
  throw new RpcException(payload)
}

export function rpcUnauthorized(
  message = 'Unauthorized',
  details?: Record<string, unknown>,
): never {
  const payload: RpcErrorPayload = { code: 'UNAUTHORIZED', message, details }
  throw new RpcException(payload)
}

export function rpcForbidden(
  message = 'Forbidden',
  details?: Record<string, unknown>,
): never {
  const payload: RpcErrorPayload = { code: 'FORBIDDEN', message, details }
  throw new RpcException(payload)
}

export function rpcNotFound(
  message = 'Not found',
  details?: Record<string, unknown>,
): never {
  const payload: RpcErrorPayload = { code: 'NOT_FOUND', message, details }
  throw new RpcException(payload)
}

export function rpcInternal(
  message = 'Internal error',
  details?: Record<string, unknown>,
): never {
  const payload: RpcErrorPayload = { code: 'INTERNAL', message, details }
  throw new RpcException(payload)
}
