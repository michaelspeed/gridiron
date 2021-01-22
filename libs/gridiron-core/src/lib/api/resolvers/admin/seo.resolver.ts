import {Args, ID, Mutation, Resolver} from '@nestjs/graphql';
import {Seo} from '../../../entity/Seo/Seo.entity';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import {SeoService} from '../../../service/services/admin/seo.service';

@Resolver(of => Seo)
export class SeoResolver extends CRUDResolver(Seo, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(Seo) readonly service: QueryService<Seo>,
        private seoService: SeoService
    ) {
        super(service);
    }

    @Mutation(() => Seo)
    createProductSeo(
        @Args('variantId', {type: () => ID}) variantId: string,
        @Args('urlKey') urlKey: string,
        @Args('metatitle') metatitle: string,
        @Args('metakeywords', {type: () => [String]}) metakeywords: string[],
        @Args('metadesc') metadesc: string,
    ): Promise<Seo> {
        return this.seoService.createProductSeo(variantId, urlKey, metatitle, metakeywords, metadesc)
    }

    @Mutation(() => Seo)
    updateProductSeo(
        @Args('seoId', {type: () => ID}) seoId: string,
        @Args('urlKey') urlKey: string,
        @Args('metatitle') metatitle: string,
        @Args('metakeywords', {type: () => [String]}) metakeywords: string[],
        @Args('metadesc') metadesc: string,
    ): Promise<Seo> {
        return this.seoService.updateProductSeo(seoId, urlKey, metatitle, metakeywords, metadesc)
    }
}
