import {Injectable, OnApplicationBootstrap, OnModuleDestroy} from '@nestjs/common';
import {ConfigService, Logger} from '../config';
import {JobQueue} from './job-queue';
import {JobQueueStrategy} from '../config/job-queue/job-queue-strategy';
import {CreateQueueOptions, JobData} from './types';
import {ID} from '../common';
import {Job} from './Job';
import {ProcessContext} from '../process-context';

@Injectable()
export class JobQueueService implements OnApplicationBootstrap, OnModuleDestroy {
    private cleanJobsTimer: NodeJS.Timeout
    private queues: Array<JobQueue<any>> = []
    private hasInitialized = false;

    private get jobQueueStrategy(): JobQueueStrategy {
        return this.configService.jobQueueOptions.jobQueueStrategy
    }

    constructor(private configService: ConfigService, private processContext: ProcessContext) {}

    async onApplicationBootstrap() {
        if (this.processContext.isServer) {
            const {pollInterval} = this.configService.jobQueueOptions
            if (pollInterval < 100) {
                Logger.warn(
                    `jobQueueOptions.pollInterval is set to ${pollInterval}ms. It is not receommended to set this lower than 100ms`
                )
            }
            await new Promise(resolve => setTimeout(resolve, 1000))
            this.hasInitialized = true
            for (const queue of this.queues) {
                if (!queue.started) {
                    queue.start()
                }
            }
        }
    }

    onModuleDestroy(): any {
        return Promise.all(this.queues.map(q => q.destroy()))
    }

    createQueue<Data extends JobData<Data>>(options: CreateQueueOptions<Data>): JobQueue<Data> {
        const {jobQueueStrategy, pollInterval} = this.configService.jobQueueOptions
        const queue = new JobQueue(options, jobQueueStrategy, pollInterval)
        if (this.processContext.isServer && this.hasInitialized) {
            queue.start()
        }
        this.queues.push(queue)
        return queue;
    }

    getJobs(id: ID): Promise<Job | undefined> {
        return this.jobQueueStrategy.findOne(id)
    }

    getJobQueue() {
        return this.queues.map(queue => ({
            name: queue.name,
            running: queue.started
        }))
    }
}
