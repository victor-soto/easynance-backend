import { ILoggerAdapter } from './adapter'

export class LoggerService implements ILoggerAdapter {
  info(message: string): void {
    console.log(message)
  }
  fatal(error: Error): void {
    console.error(error)
  }
}
