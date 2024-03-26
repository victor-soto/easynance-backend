export abstract class ILoggerAdapter {
  abstract info(message: string): void
  abstract fatal(error: Error): void
  abstract error(error: Error): void
}
