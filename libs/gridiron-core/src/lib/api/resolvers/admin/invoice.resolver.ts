import {Resolver} from "@nestjs/graphql";
import {Invoice} from "../../../entity";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";

@Resolver(() => Invoice)
export class InvoiceResolver extends CRUDResolver(Invoice, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true,
    create: {
        disabled: true
    },
    update: {
        disabled: true
    },
    delete: {
        disabled: true
    }
}) {
    constructor(
        @InjectQueryService(Invoice) readonly service: QueryService<Invoice>
    ) {
        super(service);
    }
}
