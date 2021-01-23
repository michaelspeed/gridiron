import {Resolver} from "@nestjs/graphql";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";
import { ViewCodes } from "@gridiron/entities";

@Resolver(() => ViewCodes)
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
