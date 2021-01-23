import {Resolver} from "@nestjs/graphql";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";
import { Hsn } from "@gridiron/entities";

@Resolver(() => Hsn)
export class HsnResolver extends CRUDResolver(Hsn, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(Hsn) readonly service: QueryService<Hsn>
    ) {
        super(service);
    }
}
