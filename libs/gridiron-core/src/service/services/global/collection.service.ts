import {Injectable, OnModuleInit} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {CollectionEvents, EventBus} from "../../../event-bus";
import {CollectionLineJobData, CollectionLineMessage, Job, JobQueue, JobQueueService} from "../../../job-queue";
import {WorkerService} from "../../../worker";
import {merge} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {Logger} from "../../../config";
import { BillingAgreement, BillingAgreementEnum, BillingAgreementState, Collection, Vendor, VendorPlanPrice, VendorPlans } from "@gridiron/entities";

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
                // this.doAsCollectionIsAdded(job.data.collectionId, vendorIds, job)
                this.applyCollectionLineChanges({collectionId: job.data.collectionId, vendorId: vendorIds})
            }
        })
    }

    applyCollectionLineChanges({collectionId, vendorId}: CollectionLineMessage["data"]): Promise<any> {
        return new Promise(async(resolve, reject) => {
            const collection = await this.connection.getRepository(Collection).findOne({where:{id: collectionId}})
            let completed = 0
            for (const vends of vendorId) {
                const vendor = await this.connection.getRepository(Vendor).findOne({where:{id: vends}, relations:['license', 'license.plans', 'store']})
                const plan = await this.connection.getRepository(VendorPlans).findOne({where:{id: vendor.license.plans.id}})
                const newBill = new BillingAgreement()
                newBill.type = BillingAgreementEnum.COLLECTIONBASE
                newBill.store = vendor.store
                newBill.collection = collection
                newBill.value = plan.planValue
                newBill.state = BillingAgreementState.APPROVED
                newBill.save()
                    .then(() => {
                        resolve({
                            total: vendorId.length,
                            completed: ++completed,
                            collectionId: collectionId,
                            vendorId: vends
                        })
                    })
                    .catch(err => reject(err))
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
