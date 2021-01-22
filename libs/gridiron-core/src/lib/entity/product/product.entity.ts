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
import {
    Asset,
    Collection,
    Facet,
    FacetValue,
    ProductAsset,
    ProductOptionGroup,
    ProductVariant,
    View,
    Hsn,
    Serviceable
} from '../';

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
    @ManyToOne(type => Hsn, hsn => hsn.prod)
    hsn: Hsn

    @Field(() => Collection, {nullable: true})
    @ManyToOne(type => Collection, col => col.products)
    collection: Collection

    @Field(() => [ProductOptionGroup])
    @OneToMany(type => ProductOptionGroup, optGroup => optGroup.product)
    options: ProductOptionGroup[]

    @Field(() => Asset)
    @ManyToOne(type => Asset, asset => asset.featured)
    featuredAsset: Asset

    @Field(() => [FacetValue])
    @ManyToMany(type => FacetValue, facet => facet.product)
    @JoinTable()
    facets: FacetValue[]

    @Field(() => [ProductAsset], {nullable: true})
    @OneToMany(type => ProductAsset, prasset => prasset.product)
    assets: ProductAsset[]

    @Field(() => [ProductVariant])
    @OneToMany(type => ProductVariant, variant => variant.product)
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
