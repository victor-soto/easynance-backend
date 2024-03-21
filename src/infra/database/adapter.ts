export abstract class IDatabaseAdapter {
  abstract getDatabase<T>(): T
}
