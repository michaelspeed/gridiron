import {Resolver} from "@nestjs/graphql";
import {ViewCodes} from "../../../entity";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";

@Resolver(of => ViewCodes)
export class ViewCodesResolver extends CRUDResolver(ViewCodes,{
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
}) {
    constructor(
        @InjectQueryService(ViewCodes) readonly services: QueryService<ViewCodes>
    ) {
        super(services);
    }
}
