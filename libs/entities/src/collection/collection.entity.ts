import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent,
    UpdateDateColumn
} from 'typeorm';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import {Connection, FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import { BillingAgreement } from '../billing-agreement/BillingAgreement';
import { Product } from '../product/product.entity';
import { Seo } from '../Seo/Seo.entity';
import { Asset } from '../asset/asset.entity';
import { CartPrice } from '../promotion-variant/cart-price.entity';
import { View } from '../view/view.entity';

@ObjectType('Collection', {isAbstract: true})
@Entity({name: 'collection'})
@Tree("nested-set")
@Connection('agreements', () => BillingAgreement, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('products', () => Product, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('children', () => Collection, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('parent', () => Collection, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('seo', () => Seo, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('asset', () => Asset, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('cartPrice', () => CartPrice, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class Collection extends BaseEntity {
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
    @Column({ default: false })
    isRoot: boolean;

    @FilterableField()
    @Column({ default: true })
    inMenu: boolean;

    @FilterableField()
    @Column({default: 0})
    position: number;

    @FilterableField()
    @Column({ default: false })
    isPrivate: boolean;

    @FilterableField()
    @Column()
    name: string

    @FilterableField()
    @Column("text")
    description: string

    @Field(() => [Collection])
    @TreeChildren()
    children: Collection[]

    @TreeParent()
    parent: Collection

    @Field(() => [Product])
    @OneToMany(() => Product, prod => prod.collection)
    products: Product[]

    @Field(() => Seo)
    @OneToOne(() => Seo, seo => seo.collection)
    @JoinColumn()
    seo: Seo

    @Field(() => Asset)
    @OneToOne(() => Asset, asset => asset.collection)
    @JoinColumn()
    asset: Asset

    @Field(() => [BillingAgreement])
    @OneToMany(() => BillingAgreement, agreement => agreement.collection)
    agreements: BillingAgreement[]

    @Field(() => CartPrice)
    @OneToOne(() => CartPrice, cart => cart.collection)
    cartPrice: CartPrice

    @OneToMany(() => View, view => view.collection)
    views: View[]
}
