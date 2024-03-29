import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import {Connection, FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import { ProductAsset } from './product-asset.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';
import { FacetValue } from '../facet-value/facet-value.entity';
import { ProductOptionGroup } from '../product-option-group/product-option-group.entity';
import { Serviceable } from '../serviceable/serviceable.entity';
import { Asset } from '../asset/asset.entity';
import { Collection } from '../collection/collection.entity';
import { Hsn } from '../hsn/hsn.entity';
import { View } from '../view/view.entity';

@ObjectType('Product', {isAbstract: true})
@Entity({name: 'product'})
@Connection('assets', () => ProductAsset, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('variants', () => ProductVariant, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('facets', () => FacetValue, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('options', () => ProductOptionGroup, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('serviceable', () => Serviceable, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, nullable: true})
@Relation('featuredAsset', () => Asset, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('collection', () => Collection, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('hsn', () => Hsn, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class Product extends BaseEntity {
    @FilterableField(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @FilterableField()
    @CreateDateColumn()
    createdAt: Date;

    @FilterableField()
    @UpdateDateColumn()
    updatedAt: Date;

    @FilterableField()
    @DeleteDateColumn()
    deletedAt?: Date;

    @Column({ default: true })
    enabled: boolean;

    @FilterableField()
    @Column()
    productName: string;

    @FilterableField()
    @Column()
    slug: string;

    @FilterableField()
    @Column("longtext")
    description: string;

    @Field(() => Hsn, {nullable: true})
    @ManyToOne(() => Hsn, hsn => hsn.prod)
    hsn: Hsn

    @Field(() => Collection, {nullable: true})
    @ManyToOne(() => Collection, col => col.products)
    collection: Collection

    @Field(() => [ProductOptionGroup])
    @OneToMany(() => ProductOptionGroup, optGroup => optGroup.product)
    options: ProductOptionGroup[]

    @Field(() => Asset)
    @ManyToOne(() => Asset, asset => asset.featured)
    featuredAsset: Asset

    @Field(() => [FacetValue])
    @ManyToMany(() => FacetValue, facet => facet.product)
    @JoinTable()
    facets: FacetValue[]

    @Field(() => [ProductAsset], {nullable: true})
    @OneToMany(() => ProductAsset, prasset => prasset.product)
    assets: ProductAsset[]

    @Field(() => [ProductVariant])
    @OneToMany(() => ProductVariant, variant => variant.product)
    variants: ProductVariant[]

    @Field(() => Serviceable)
    @ManyToOne(() => Serviceable, serviceable => serviceable.product)
    serviceable: Serviceable

    @OneToMany(() => View, view => view.product)
    views: View[]

    @Field(() => [String])
    @Column("simple-array")
    viewcode: string[]
}
