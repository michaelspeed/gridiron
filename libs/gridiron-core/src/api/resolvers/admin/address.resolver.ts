import {Resolver} from "@nestjs/graphql";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";
import { Address } from "@gridiron/entities";

@Resolver(() => Address)
export class AddressResolver extends CRUDResolver(Address, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(Address) readonly service: QueryService<Address>
    ) {
        super(service);
    }
}
