import {GridIronEntity} from '../../../entity/base/base.entity';
import {BaseEntity, Connection, FindConditions, FindManyOptions, FindOneOptions, FindOptionsUtils, SelectQueryBuilder} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectConnection} from '@nestjs/typeorm';
import {ListQueryOptions, Type} from '../../../common';
import {parseSortParams} from './parse-sort-params';
import {parseFilterParams} from './parse-filter-params';

export type ExtendedListQueryOptions<T extends GridIronEntity | BaseEntity> = {
    relations?: string[]
    where?: FindConditions<T>,
    orderBy?: FindOneOptions<T>['order']
}

@Injectable()
export class ListQueryBuilder {
    constructor(
        @InjectConnection() private connection: Connection
    ) {}

    build<T extends GridIronEntity | BaseEntity>(
        entity: Type<T>,
        options: ListQueryOptions<T> = {},
        extendedOptions: ExtendedListQueryOptions<T> = {}
    ): SelectQueryBuilder<T> {
        const skip = options.skip
        let take = options.take
        if (options.skip !== undefined && options.take === undefined) {
            take = Number.MAX_SAFE_INTEGER
        }
        const sort = parseSortParams(
            this.connection,
            entity,
            Object.assign({}, options.sort, extendedOptions.orderBy)
        )
        const filter = parseFilterParams(this.connection, entity, options.filter)

        const qb = this.connection.createQueryBuilder<T>(entity, entity.name.toLowerCase())
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, {
            relations: extendedOptions.relations,
            take,
            skip,
            where: extendedOptions.where || {}
        } as FindManyOptions<T>)
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata)

        filter.forEach(({clause, parameters}) => {
            qb.andWhere(clause, parameters)
        })

        return qb.orderBy(sort)
    }
}
