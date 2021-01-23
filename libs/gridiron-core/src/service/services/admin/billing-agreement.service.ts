import {Injectable, OnModuleInit} from '@nestjs/common';
import {EventBus, VendorEvents} from '../../../event-bus';
import {BillingAgreement, BillingAgreementRequest, Collection, ProductVariant, Store, Vendor} from '../../../entity';
import {BillingAgreementEnum, BillingAgreementState} from '../../../enums/BillingAgreementEnum';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection} from 'typeorm';
import {JobQueue, JobQueueService} from '../../../job-queue/';

@Injectable()
export class BillingAgreementService implements OnModuleInit {

    private createBillingAgreementOnVendorCreation: JobQueue<string>

    constructor(
        @InjectConnection() private connection: Connection,
        private eventBus: EventBus,
        private jobQueueService: JobQueueService
    ) {}

    onModuleInit() {
        const vendorEvent$ = this.eventBus.ofType(VendorEvents)

        vendorEvent$.subscribe(value => {
            this.createBillingAgreementOnVendorCreation.add(JSON.stringify(value.vendor))
        })

        this.createBillingAgreementOnVendorCreation = this.jobQueueService.createQueue({
            name: 'create-vendor-billing-agreement',
            concurrency: 1,
            process: async (job) => {
                if (JSON.parse(job.data).license.plans.priceStrategy === 'INDIVIDUALCOLLECTION') {
                    this.onCreateVendorMultipleAgreement(JSON.parse(job.data))
                } else {
                    this.onCreatedVendorBillingAgreement(JSON.parse(job.data))
                }
            }
        })

    }

    onCreatedVendorBillingAgreement(vendor: Vendor): Promise<BillingAgreement> {
        return new Promise<BillingAgreement>((resolve, reject) => {
            const billingAgreement = new BillingAgreement()
            if (vendor.license.plans.priceStrategy === 'FLAT') {
                billingAgreement.type = BillingAgreementEnum.PLANBASE
            } else if (vendor.license.plans.priceStrategy === 'COMMISSION') {
                billingAgreement.type = BillingAgreementEnum.COMISSIONBASE
            }
            billingAgreement.state = BillingAgreementState.APPROVED
            billingAgreement.value = vendor.license.plans.planValue
            billingAgreement.store = vendor.store
            this.connection.getRepository(BillingAgreement).save(billingAgreement).then(value => resolve(value)).catch(error => reject(error))
        })
    }

    onCreateVendorMultipleAgreement(vendor: Vendor): Promise<BillingAgreement[]> {
        return new Promise<BillingAgreement[]>(async (resolve, reject) => {
            const allBillingAgreement: BillingAgreement[] = []
            const allCollection = await this.connection.getRepository(Collection).find()
            for (let col of allCollection) {
                const billingAgreement = new BillingAgreement()
                billingAgreement.type = BillingAgreementEnum.COLLECTIONBASE
                billingAgreement.store = vendor.store
                billingAgreement.state = BillingAgreementState.APPROVED
                billingAgreement.value = vendor.license.plans.planValue
                billingAgreement.collection = col
                const savedAgreement = await this.connection.getRepository(BillingAgreement).save(billingAgreement)
                allBillingAgreement.push(savedAgreement)
            }
            resolve(allBillingAgreement)
        })
    }

    findAll(): Promise<BillingAgreement[]> {
        return this.connection.getRepository(BillingAgreement).find({order: {createdAt: 'DESC'}, relations: ['collection', 'collection.parent', 'request']})
    }

    findAgreementById(id: string): Promise<BillingAgreement> {
        return this.connection.getRepository(BillingAgreement).findOne({where:{id}, relations: ['collection', 'collection.parent', 'request']})
    }

    findAgreementByVendor(vendorId: string) : Promise<BillingAgreement[]> {
        return new Promise<BillingAgreement[]>(async (resolve, reject) => {
            const vendor = await this.connection.getRepository(Vendor).findOne({where:{id: vendorId}, relations: ['store']})
            console.log(vendor)
            this.connection.getRepository(BillingAgreement).find({
                where: {
                    store: {
                        id: vendor.store.id
                    }
                },
                relations: ['collection', 'collection.parent', 'request']
            }).then(value => {
                console.log(value)
                resolve(value)
            }).catch(error => reject(error))
        })
    }

    createBillingAgreementRequest(id, value): Promise<BillingAgreementRequest> {
        return new Promise<BillingAgreementRequest>(async (resolve, reject) => {
            const billRequest = new BillingAgreementRequest()
            billRequest.value = value
            const billAgreement = await this.connection.getRepository(BillingAgreement).findOne({where:{id}})
            billRequest.agreement = billAgreement
            this.connection.getRepository(BillingAgreementRequest).save(billRequest)
                .then(value1 => {
                    resolve(value1)
                }).catch(error => {
                    reject(error)
            })
        })
    }

    findBillingRequestForBillingAgreement(id: string): Promise<BillingAgreementRequest[]> {
        return this.connection.getRepository(BillingAgreementRequest).find({
            where: {
                agreement: {
                    id
                }
            },
            order: {
                updatedAt: 'DESC'
            }
        })
    }

    updateBillingAgreementRequest(id, value): Promise<BillingAgreementRequest> {
        return new Promise<BillingAgreementRequest>(async (resolve, reject) => {
            const billRequest = await this.connection.getRepository(BillingAgreementRequest).findOne({where:{id}, relations: ['agreement']})
            billRequest.state = value
            if (value === BillingAgreementState.APPROVED) {
                const billargee = await this.connection.getRepository(BillingAgreement).findOne({where:{id: billRequest.agreement.id}})
                billargee.value = billRequest.value
                await this.connection.getRepository(BillingAgreement).save(billargee)
            }
            this.connection.getRepository(BillingAgreementRequest).save(billRequest).then(value1 => {
                resolve(value1)
            }).catch(error => reject(error))
        })
    }

    createProdBillingAgreement(value: number, variantId: string, storeId: string): Promise<BillingAgreement> {
        return new Promise<BillingAgreement>(async (resolve, reject) => {
            const billAgree = new BillingAgreement()
            billAgree.variant = await this.connection.getRepository(ProductVariant).findOne({where:{id: variantId}})
            billAgree.type = BillingAgreementEnum.PRODCOMMISSION
            billAgree.store = await this.connection.getRepository(Store).findOne({where:{id: storeId}})
            billAgree.state = BillingAgreementState.APPROVED
            billAgree.value = value
            this.connection.getRepository(BillingAgreement)
                .save(billAgree)
                .then(value1 => {
                    resolve(value1)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    async getBillingAgreementForStore(storeId: string, variantId: string): Promise<BillingAgreement> {
        return new Promise<BillingAgreement>(async (resolve, reject) => {
            this.connection.getRepository(BillingAgreement)
                .findOne({store:{id: storeId}, variant:{id: variantId}})
                .then(value => resolve(value)).catch(error => reject(error))
        })
    }

    async updateBillingAgreementForStore(id: string, value: number): Promise<BillingAgreement> {
        return new Promise(async (resolve, reject) => {
            const billId = await this.connection.getRepository(BillingAgreement).findOne({where:{id}})
            billId.value = value
            this.connection.getRepository(BillingAgreement)
                .save(billId)
                .then(value1 => resolve(value1))
                .catch(error => reject(error))
        })
    }
}
