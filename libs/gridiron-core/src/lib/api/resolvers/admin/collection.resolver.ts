import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Collection} from '../../../entity';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import {CollectionService} from '../../../service/services/admin/collection.service';

@Resolver(of => Collection)
export class CollectionResolver extends CRUDResolver(Collection,{
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(Collection) readonly service: QueryService<Collection>,
        private readonly collectionService: CollectionService
    ) {
        super(service);
    }

    @Query(() => [Collection])
    async GetCollectionTree(): Promise<Collection[]> {
        return this.collectionService.GetCollectionTree()
    }

    @Mutation(() => Collection)
    async AddParentToChildCollection(
        @Args('parentId') parentId: string,
        @Args('childId') childId: string,
    ): Promise<Collection> {
        return this.collectionService.AddParentToChildCollection(parentId, childId)
    }
}
