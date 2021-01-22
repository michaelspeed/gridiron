import {ID, JobState, JsonCompatible} from '../common';
import {Job} from './Job';

export type JobData<T> = JsonCompatible<T>;

export interface JobConfig<T extends JobData<T>> {
    queueName: string
    data: T
    retries?: number
    attempts?: number
    id?: ID
    state?: JobState
    progress?: number
    result?: any
    error?: any
    createdAt?: Date
    startedAt?: Date
    settledAt?: Date
}

export interface CreateQueueOptions<T extends JobData<T>> {
    name: string
    concurrency: number
    process: (job: Job<T>) => any | Promise<any>
}
