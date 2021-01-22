import {Resolver} from "@nestjs/graphql";
import {StockBackLog} from "../../../entity";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";

@Resolver(() => StockBackLog)
export class StockBackLogResolver extends CRUDResolver(StockBackLog, {
    create: {
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
        @InjectQueryService(StockBackLog) readonly service: QueryService<StockBackLog>
    ) {
        super(service);
    }
}
