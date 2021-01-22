import {JobQueueStrategy} from '../config/job-queue/job-queue-strategy';
import {ID, JobState, notNullOrUndefined} from '../common';
import {Job} from './Job';

export class InMemoryJobQueueStrategy implements JobQueueStrategy {
    protected jobs = new Map<ID, Job>();
    protected unsettledJobs: { [queueName: string]: Job[] } = {};
    private timer: any;
    private evictJobsAfterMs = 1000 * 60 * 60 * 2; // 2 hours

    init() {
        this.timer = setTimeout(this.evictSettledJobs, this.evictJobsAfterMs);
    }

    destroy() {
        clearTimeout(this.timer);
    }

    async add(job: Job): Promise<Job> {
        if (!job.id) {
            (job as any).id = Math.floor(Math.random() * 1000000000)
                .toString()
                .padEnd(10, '0');
        }
        // tslint:disable-next-line:no-non-null-assertion
        this.jobs.set(job.id!, job);
        if (!this.unsettledJobs[job.queueName]) {
            this.unsettledJobs[job.queueName] = [];
        }
        this.unsettledJobs[job.queueName].push(job);
        return job;
    }

    async findOne(id: ID): Promise<Job | undefined> {
        return this.jobs.get(id);
    }

    async findMany(options?: any): Promise<any> {}

    async findManyById(ids: ID[]): Promise<Job[]> {
        return ids.map(id => this.jobs.get(id)).filter(notNullOrUndefined);
    }

    async next(queueName: string): Promise<Job | undefined> {
        const next = this.unsettledJobs[queueName]?.shift();
        if (next) {
            next.start();
            return next;
        }
    }

    async update(job: Job): Promise<void> {
        if (job.state === JobState.RETRYING || job.state === JobState.PENDING) {
            this.unsettledJobs[job.queueName].unshift(job);
        }
        // tslint:disable-next-line:no-non-null-assertion
        this.jobs.set(job.id!, job);
    }

    async removeSettledJobs(queueNames: string[] = [], olderThan?: Date): Promise<number> {
        let removed = 0;
        for (const job of this.jobs.values()) {
            if (0 < queueNames.length && !queueNames.includes(job.queueName)) {
                continue;
            }
            if (job.isSettled) {
                if (olderThan) {
                    if (job.settledAt && job.settledAt < olderThan) {
                        // tslint:disable-next-line:no-non-null-assertion
                        this.jobs.delete(job.id!);
                        removed++;
                    }
                } else {
                    // tslint:disable-next-line:no-non-null-assertion
                    this.jobs.delete(job.id!);
                    removed++;
                }
            }
        }
        return removed;
    }

    /**
     * Delete old jobs from the `jobs` Map if they are settled and older than the value
     * defined in `this.pruneJobsAfterMs`. This prevents a memory leak as the job queue
     * grows indefinitely.
     */
    private evictSettledJobs = () => {
        const nowMs = +new Date();
        const olderThanMs = nowMs - this.evictJobsAfterMs;
        this.removeSettledJobs([], new Date(olderThanMs));
        this.timer = setTimeout(this.evictSettledJobs, this.evictJobsAfterMs);
    };
}
