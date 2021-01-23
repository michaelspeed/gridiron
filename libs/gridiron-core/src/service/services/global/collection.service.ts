import {Injectable, OnModuleInit} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {CollectionEvents, EventBus} from "../../../event-bus";
import {CollectionLineJobData, CollectionLineMessage, Job, JobQueue, JobQueueService} from "../../../job-queue";
import {WorkerService} from "../../../worker";
import {merge} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {Logger} from "../../../config";
import { Vendor, VendorPlanPrice } from "@gridiron/entities";

@Injectable()
export class GlobalCollectionsService implements OnModuleInit {

    private applyCollectionQueue: JobQueue<CollectionLineJobData>

    constructor(
        @InjectConnection() private connection: Connection,
        private eventBus: EventBus,
        private jobQueueService: JobQueueService,
        private workerService: WorkerService
    ) {}

    onModuleInit(): any {
        const collectionEvents$ = this.eventBus.ofType(CollectionEvents)
        merge(collectionEvents$)
            .pipe(debounceTime(50))
            .subscribe(async (event: CollectionEvents) => {
                this.applyCollectionQueue.add({
                    collectionId: event.collection.id
                })
            })
        this.applyCollectionQueue = this.jobQueueService.createQueue({
            name: 'ApplyCollectionChanges',
            concurrency: 1,
            process: async (job) => {
                const allNecessaryVendors = await this.connection.getRepository(Vendor).find({where:{license:{plans:{priceStrategy: VendorPlanPrice.INDIVIDUALCOLLECTION}}}})
                const vendorIds = allNecessaryVendors.map(item => item.id)
                this.doAsCollectionIsAdded(job.data.collectionId, vendorIds, job)
            }
        })
    }

    // collection Listeners
    async doAsCollectionIsAdded(collectionId: string, vendorIds: string[], job: Job<CollectionLineJobData>): Promise<void> {
        this.workerService.send(new CollectionLineMessage({collectionId: collectionId, vendorId: vendorIds}))
            .subscribe({
                next: ({completed, total}) => {
                    const progress = Math.ceil((completed / total) * 100)
                    job.setProgress(progress)
                },
                complete: () => {
                    job.complete()
                },
                error: err => {
                    Logger.error(err)
                    job.fail(err)
                }
            })
    }

}
