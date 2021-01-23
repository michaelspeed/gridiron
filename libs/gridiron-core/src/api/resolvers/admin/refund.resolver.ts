import {Resolver} from "@nestjs/graphql";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";
import { Refund } from "@gridiron/entities";

@Resolver(() => Refund)
export class RefundResolver extends CRUDResolver(Refund, {
    create: {
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
        @InjectQueryService(Refund) readonly service: QueryService<Refund>
    ) {
        super(service);
    }
}
