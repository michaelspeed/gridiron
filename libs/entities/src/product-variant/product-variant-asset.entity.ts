import {
    BaseEntity,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import {FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import { ProductVariant } from './product-variant.entity';
import { Asset } from '../asset/asset.entity';
@ObjectType('ProductVariantAsset', {isAbstract: true})
@Entity({name: 'productVariantAsset'})
@Relation('variant', () => ProductVariant, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('asset', () => Asset, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class ProductVariantAsset extends BaseEntity {
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

    @Field(() => Asset)
    @ManyToOne(() => Asset, asset => asset.variantAsset)
    asset: Asset

    @Field(() => ProductVariant)
    @OneToOne(() => ProductVariant, variant => variant.asset)
    @JoinColumn()
    variant: ProductVariant
}
