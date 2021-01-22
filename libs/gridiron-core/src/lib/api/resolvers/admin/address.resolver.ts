import {Resolver} from "@nestjs/graphql";
import {Address} from "../../../entity";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";

@Resolver(of => Address)
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
