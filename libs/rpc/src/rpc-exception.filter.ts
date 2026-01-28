import { ArgumentsHost, Catch, HttpException } from '@nestjs/common'
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices'
import { RpcErrorPayload } from './rpc.types'

@Catch()
export class RpcAllExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof RpcException) {
      return super.catch(exception, host)
    }

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500

    // In RPC context, we want the exception response, not the host response
    const response =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error'

    const details =
      typeof response === 'object' && response !== null
        ? (response as Record<string, unknown>)
        : {}

    if (status === 400) {
      const payload: RpcErrorPayload = {
        code: 'VALIDATION_ERROR',
        message: JSON.stringify(details),
        details,
      }

      return super.catch(new RpcException(payload), host)
    }

    const payload: RpcErrorPayload = {
      code: 'INTERNAL',
      message: 'Internal error',
      details,
    }

    return super.catch(new RpcException(payload), host)
  }
}
