import {JobQueueStrategy} from '../config/job-queue/job-queue-strategy';
import {CreateQueueOptions, JobConfig, JobData} from './types';
import {Job} from './Job';

export class JobQueue<Data extends JobData<Data> = {}> {
    private activeJobs: Array<Job<Data>> = []
    private timer: any;
    private fooId: number;
    private running = false;

    get concurrency(): number {
        return this.options.concurrency
    }

    get name(): string {
        return this.options.name
    }

    get started(): boolean {
        return this.running
    }

    constructor(
        private options: CreateQueueOptions<Data>,
        private jobQueueStrategy: JobQueueStrategy,
        private pollInterval: number
    ) {}

    start() {
        if(this.running) {
            return;
        }
        this.running = true
        const concurrency = this.options.concurrency
        const runNextJobs = async () => {
            const runningJobsCount = this.activeJobs.length
            for (let i = runningJobsCount; i < concurrency; i++) {
                const nextJob: Job<Data> | undefined = await this.jobQueueStrategy.next(this.options.name)
                if (nextJob) {
                    this.activeJobs.push(nextJob)
                    await this.jobQueueStrategy.update(nextJob)
                    nextJob.on('complete', job => this.onFailOrComplete(job))
                    nextJob.on('progress', job => this.jobQueueStrategy.update(job))
                    nextJob.on('fail', job => this.onFailOrComplete(job))
                    try {
                        const returnVal = this.options.process(nextJob)
                        if (returnVal instanceof Promise) {
                            returnVal.catch(err => nextJob.fail(err))
                        }
                    } catch (e) {
                        nextJob.fail(e)
                    }
                }
            }
            if (this.running) {
                this.timer = setTimeout(runNextJobs, this.pollInterval)
            }
        }
        runNextJobs()
    }

    pause() {
        this.running = false;
        clearTimeout(this.timer)
    }

    async destroy(): Promise<void> {
        this.running = false
        clearTimeout(this.timer)
        const start = +new Date()
        const maxTimeout = 2000;
        return new Promise(resolve => {
            const pollActiveJobs = async () => {
                const timedOut = +new Date() - start > maxTimeout
                if (this.activeJobs.length === 0 || timedOut) {
                    for (const job of this.activeJobs) {
                        job.defer()
                        await this.jobQueueStrategy.update(job)
                    }
                    resolve()
                } else {
                    setTimeout(pollActiveJobs, 50)
                }
            };
            pollActiveJobs()
        })
    }

    add(data: Data, options?: Pick<JobConfig<Data>, 'retries'>) {
        const job = new Job<any>({
            data,
            queueName: this.options.name,
            retries: options?.retries ?? 0
        })
        return this.jobQueueStrategy.add(job)
    }

    private async onFailOrComplete(job: Job<Data>) {
        await this.jobQueueStrategy.update(job)
        this.removeJobFromActive(job)
    }

    private async removeJobFromActive(job: Job<Data>) {
        const index = this.activeJobs.indexOf(job)
        this.activeJobs.splice(index, 1)
    }
}
