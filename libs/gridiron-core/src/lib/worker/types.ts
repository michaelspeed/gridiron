export abstract class WorkerMessage<T, R> {
    static readonly pattern: string
    constructor(public data: T) {}
    response: R
}
