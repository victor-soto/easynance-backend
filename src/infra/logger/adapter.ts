export abstract class ILoggerAdapter {
  abstract info(message: string): void
  abstract fatal(error: Error): void
}
