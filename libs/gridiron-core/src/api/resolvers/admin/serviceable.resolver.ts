import {Args, ID, Mutation, Resolver} from "@nestjs/graphql";
import {Product, Serviceable, Vendor} from "../../../entity";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";
import { ServiceableService } from "../../../service";

@Resolver(of => Serviceable)
export class ServiceableResolver extends CRUDResolver(Serviceable, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){

    constructor(
        @InjectQueryService(Serviceable) readonly service: QueryService<Serviceable>,
        private serviceableService: ServiceableService
    ){
        super(service)
    }

    @Mutation(() => Serviceable)
    async AddServiceToVendor(
        @Args('service', {type: () => ID}) service: string,
        @Args('vendor', {type: () => ID}) vendor: string,
    ) {
        return this.serviceableService.addServiceableToVendor(service, vendor)
    }

    @Mutation(() => Serviceable)
    async AddServiceToProduct(
        @Args('service', {type: () => ID}) service: string,
        @Args('product', {type: () => ID}) product: string,
    ) {
        return this.serviceableService.addServiceableToProduct(service, product)
    }

    @Mutation(() => Product)
    async removeServiceableToProduct(
        @Args('product', {type: () => ID}) product: string,
    ) {
        return this.serviceableService.removeServiceableToProduct(product)
    }

    @Mutation(() => Vendor)
    async removeServiceableToVendor(
        @Args('vendor', {type: () => ID}) vendor: string,
    ) {
        return this.serviceableService.removeServiceableToVendor(vendor)
    }

}
