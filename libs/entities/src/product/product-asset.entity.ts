import {
    BaseEntity,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import { Product } from './product.entity';
import { Asset } from '../asset/asset.entity';

@ObjectType('ProductAsset', {isAbstract: true})
@Entity('product-asset')
@Relation('product', () => Product, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('asset', () => Asset, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class ProductAsset extends BaseEntity {
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

    @Field(() => Product)
    @ManyToOne(() => Product, prod => prod.assets)
    product: Product

    @Field(() => Asset)
    @ManyToOne(() => Asset, asset => asset.productAsset)
    asset: Asset
}
