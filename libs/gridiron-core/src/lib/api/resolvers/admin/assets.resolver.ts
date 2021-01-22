import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Asset} from '../../../entity';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import {AssetsService} from '../../../service/services/admin/assets.service';
import {GraphQLUpload} from 'apollo-server-core';
import {FileUpload} from 'graphql-upload';
import {PaginatedList} from '../../../common';

@Resolver(of => Asset)
export class AssetsResolver extends CRUDResolver(Asset, {
    create: {
        disabled: true
    },
    update: {
        disabled: true
    },
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){

    constructor(
        @InjectQueryService(Asset) readonly service: QueryService<Asset>,
        private readonly assetService: AssetsService
    ) {
        super(service)
    }

    /*@Query(() => [Asset])
    async getallAssets(): Promise<Asset[]> {
        return new Promise(async (resolve, reject) => {
            const assets = await this.assetService.findAllSimple()
            console.log(assets)
            resolve(assets)
        })
    }*/

    @Mutation(() => Asset)
    async createAsset(
        @Args('file', {type: () => GraphQLUpload}) args: FileUpload
    ): Promise<Asset> {
        console.log(args)
        const asset = await this.assetService.create(args)
        return asset
    }

    /*@Mutation(() => Asset)
    async updateAsset(
        @Args('input', {type: () => MutationUpdateAssetArgs}) {input}: MutationUpdateAssetArgs
    ): Promise<Asset> {
        return this.assetService.update(input)
    }*/
}
