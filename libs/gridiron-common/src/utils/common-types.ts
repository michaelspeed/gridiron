export type ReadOnlyRequired<T> = { +readonly [K in keyof T]-?: T[K] };

export enum JobState {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    RETRYING = 'RETRYING',
    FAILED = 'FAILED',
}
