import {Args, Float, ID, Mutation, Query, Resolver} from '@nestjs/graphql';
import {VendorPlans} from '../../../entity';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import {VendorService} from '../../../service';
import {VendorPlanPrice, VendorPlanTenure} from '../../../enums/VendorPlan';
import {VendorPlanService} from '../../../service/services/admin/vendor-plan.service';

@Resolver(of => VendorPlans)
export class VendorPlansResolver extends CRUDResolver(VendorPlans, {
    create: {
        disabled: true
    },
    update: {
        disabled: true
    },
    delete: {
        disabled: true
    },
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(VendorPlans) readonly service: QueryService<VendorPlans>,
        private readonly vendorService: VendorService,
        private readonly vendorPlanService: VendorPlanService
    ) {
        super(service);
    }

    @Mutation(() => VendorPlans)
    async CreatePlan(
        @Args('name', {type: () => String}) name: string,
        @Args('value', {type: () => Float}) value: number,
        @Args('priceStrategy', {type: () => VendorPlanPrice}) priceStrategy: VendorPlanPrice,
        @Args('tenureStrategy', {type: () => VendorPlanTenure}) tenureStrategy: VendorPlanTenure,
    ): Promise<VendorPlans> {
        return this.vendorService.createVendorPlans(name, value, priceStrategy, tenureStrategy)
    }

    @Mutation(() => VendorPlans)
    async UpdatePlan(
        @Args('id', {type: () => ID}) id: string,
        @Args('status', {type: () => Boolean}) status: boolean,
    ): Promise<VendorPlans> {
        return this.vendorService.updatePlan(id, status)
    }

    @Query(() => [VendorPlans])
    async FindAllVendorPlans(): Promise<VendorPlans[]> {
        return this.vendorPlanService.findAll()
    }

    @Query(() => [VendorPlans])
    async GetVendorPlansForRegistration(): Promise<VendorPlans[]> {
        return this.vendorPlanService.getVendorPlansForRegistration()
    }
}
