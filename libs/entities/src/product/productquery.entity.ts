import {ID, ObjectType} from "@nestjs/graphql";
import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Connection, FilterableField, PagingStrategies, Relation} from "@nestjs-query/query-graphql";
import { ProductAsset, ProductVariant, FacetValue, ProductOptionGroup, Asset, Collection } from "..";

@ObjectType('Product', {isAbstract: true})
@Connection('assets', () => ProductAsset, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('variants', () => ProductVariant, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('facets', () => FacetValue, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('options', () => ProductOptionGroup, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('featuredAsset', () => Asset, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('collection', () => Collection, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class ProductQuery {
    @FilterableField(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @FilterableField()
    @CreateDateColumn()
    createdAt: Date;

    @FilterableField()
    @UpdateDateColumn()
    updatedAt: Date;

    enabled: boolean;

    @FilterableField()
    productName: string;

    @FilterableField()
    slug: string;

    @FilterableField()
    description: string;

    collection: Collection

    options: ProductOptionGroup[]

    featuredAsset: Asset

    facets: FacetValue[]

    assets: ProductAsset[]

    variants: ProductVariant[]
}
