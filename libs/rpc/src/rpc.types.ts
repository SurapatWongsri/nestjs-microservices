export type RpcErrorCode =
  | 'BAD_REQUEST'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'INTERNAL'

export type RpcErrorPayload = {
  code: RpcErrorCode
  message: string
  details?: Record<string, unknown>
}
