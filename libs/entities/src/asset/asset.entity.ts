import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Field, ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {Connection, FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {FocalPoint} from '../common/FocalPoint';
import {GraphQLJSONObject} from 'graphql-type-json';
import {AssetsFolder} from './assets-folder.entity';
import {DeepPartial} from '@gridiron/gridiron-common';
import { AssetType } from '../enums/AssetType';
import { ProductAsset } from '../product/product-asset.entity';
import { Product } from '../product/product.entity';
import { Collection } from '../collection/collection.entity';
import { Menu } from '../menu/menu.entity';
import { Store } from '../Store/store.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';

registerEnumType(AssetType, {
    name: 'AssetType'
})

@ObjectType('Asset', {isAbstract: true})
@Entity({name: 'Asset'})
@Connection('productAsset', () => ProductAsset, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'productAsset'})
@Connection('featured', () => Product, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'featured'})
@Relation('collection', () => Collection, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'collection'})
@Relation('menu', () => Menu, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'menu'})
@Relation('store', () => Store, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'store'})
export class Asset extends BaseEntity {

    constructor(input?: DeepPartial<Asset>) {
        super();
        if (input) {
            for (const [key, value] of Object.entries(input)) {
                (this as any)[key] = value
            }
        }
    }

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

    @FilterableField()
    @Column()
    name: string;

    @FilterableField(() => AssetType)
    @Column('varchar')
    type: AssetType;

    @FilterableField()
    @Column()
    mimeType: string;

    @FilterableField()
    @Column({ default: 0 })
    width: number;

    @FilterableField()
    @Column({ default: 0 })
    height: number;

    @FilterableField()
    @Column()
    fileSize: number;

    @FilterableField()
    @Column()
    source: string;

    @FilterableField()
    @Column()
    preview: string;

    @OneToMany(() => ProductVariant, vr => vr.asset)
    variantAsset: ProductVariant[]

    @OneToMany(() => Product, pr => pr.featuredAsset)
    featured: Product[]

    @OneToMany(() => ProductAsset, passet => passet.asset)
    productAsset: ProductAsset[]

    @Field(() => GraphQLJSONObject)
    @Column('simple-json', { nullable: true })
    focalPoint?: FocalPoint;

    @ManyToOne(() => AssetsFolder)
    folder: AssetsFolder

    @OneToOne(() => Collection, collection => collection.asset)
    collection: Collection

    @OneToOne(() => Menu, menu => menu.asset)
    menu: Menu

    @OneToOne(() => Store, store => store.logo)
    store: Store
}
