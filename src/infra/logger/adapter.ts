import { ErrorType, MessageType } from './types'

export abstract class ILoggerAdapter {
  abstract connect(logLevel: string): Promise<void>
  abstract setApplication(app: string): void
  abstract log(message: string): void
  abstract info({ message, context, obj }: MessageType): void
  abstract warn({ message, context, obj }: MessageType): void
  abstract fatal(error: ErrorType, message?: string, context?: string): void
  abstract error(error: ErrorType, message?: string, context?: string): void
}
