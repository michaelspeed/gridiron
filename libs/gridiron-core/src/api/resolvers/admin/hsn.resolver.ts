import {Resolver} from "@nestjs/graphql";
import {Hsn} from "../../../entity";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";

@Resolver(of => Hsn)
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
