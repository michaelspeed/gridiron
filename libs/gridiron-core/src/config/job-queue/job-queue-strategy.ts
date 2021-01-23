import {ID, InjectableStrategy} from '../../common';
import {Job} from '../../job-queue';

export interface JobQueueStrategy extends InjectableStrategy {
    add(job: Job): Promise<Job>
    next(queueName: string): Promise<Job | undefined>
    update(job: Job): Promise<void>
    findOne(id: ID): Promise<Job | undefined>
    findMany(options?: any): Promise<any>
    findManyById(ids: ID[]): Promise<Job[]>
    removeSettledJobs(queueNames?: string[], olderThan?: Date): Promise<number>
}
