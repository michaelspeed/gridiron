import {Controller} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {MessagePattern} from "@nestjs/microservices";
import {asyncObservable} from "../../worker";
import {Observable} from "rxjs";
import {CollectionLineMessage} from "../../job-queue";
import { Collection, Vendor, VendorPlans, BillingAgreement, BillingAgreementEnum, BillingAgreementState } from "@gridiron/entities";

@Controller()
export class CollectionController {
    constructor(
        @InjectConnection() private connection: Connection
    ) {}

    @MessagePattern(CollectionLineMessage.pattern)
    applyCollectionLineChanges({collectionId, vendorId}: CollectionLineMessage["data"]): Observable<CollectionLineMessage["response"]> {
        return asyncObservable(async observer => {
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
                        observer.next({
                            total: vendorId.length,
                            completed: ++completed,
                            collectionId: collectionId,
                            vendorId: vends
                        })
                    })
            }
        })
    }
}
