import {Args, ID, Mutation, Resolver} from "@nestjs/graphql";
import {Settlements} from "../../../entity/settlement/settlement.entity";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";
import {SettlementService} from "../../../service";

@Resolver(() => Settlements)
export class SettlementsResolver extends CRUDResolver(Settlements, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true,
    create:{
        disabled: true
    },
    update: {
        disabled: true
    },
    delete: {
        disabled: true
    }
}){
    constructor(
        @InjectQueryService(Settlements) readonly service: QueryService<Settlements>,
        private readonly settlementService: SettlementService
    ) {
        super(service);
    }

    @Mutation(() => Settlements)
    async CreateSettlement(
        @Args('storeId', {type: () => ID}) storeId: string,
    ): Promise<Settlements> {
        return this.settlementService.CreateSettlement(storeId)
    }

    @Mutation(() => Settlements)
    async UpdateSettlement(
        @Args('settlementId', {type: () => ID}) settlementId: string,
        @Args('transactionId', {type: () => String, nullable: true}) transactionId: string,
    ): Promise<Settlements> {
        return this.settlementService.UpdateSettlement(transactionId, settlementId)
    }
}
