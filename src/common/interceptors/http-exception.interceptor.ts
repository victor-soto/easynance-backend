import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common'
import { catchError, Observable } from 'rxjs'
import { ZodError } from 'zod'

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        error.status = this.getStatusCode(error)
        const headers = context.getArgByIndex(0)?.headers
        this.sanitizeExternalError(error)
        if (typeof error === 'object' && !error.traceId) error.traceId = headers.traceId
        if (!error?.context) {
          const ctx = `${context.getClass().name}/${context.getHandler().name}`
          error.context = ctx
        }
        throw error
      })
    )
  }

  private getStatusCode(error: any) {
    if (error instanceof ZodError) return HttpStatus.BAD_REQUEST
    if (error?.code === 'ECONNABORTED' || error?.code === 'ECONNRESET') return HttpStatus.REQUEST_TIMEOUT
    return [
      error.status,
      error?.response?.status,
      error?.response?.data?.code,
      error?.response?.data?.error?.code
    ].find(Boolean)
  }

  private sanitizeExternalError(error: any) {
    if (typeof error?.response === 'object' && error?.isAxiosError) {
      const status = [error?.response?.data?.code, error?.response?.data?.error?.code, error?.status].find(Boolean)
      error.message = [error?.response?.data?.message, error?.response?.data?.error?.message, error.message].find(
        Boolean
      )
      error['getResponse'] = () => [error?.response?.data?.error, error?.response?.data].find(Boolean)
      error['getStatus'] = () => status
    }
  }
}
