import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import {Connection, FilterableField, FilterableRelation, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import { ProductVariant } from './product-variant.entity';
import { TaxRate } from '../tax-rate/tax-rate.entity';
import { Store } from '../Store/store.entity';
import { PromotionVariantPrice } from '../promotion-variant/promotion-variant-price.entity';
import { StockBackLog } from '../stock-movement/stock-back-log.entity';
import { Hsn } from '../hsn/hsn.entity';
import { CartItem } from '../cart/cartItem.entity';

@ObjectType('ProductVariantPrice', {isAbstract: true})
@Entity({name: 'productVariantPrice'})
@FilterableRelation('variant', () => ProductVariant)
@Relation('tax', () => TaxRate, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, nullable: true})
@FilterableRelation('store', () => Store, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('promoprice', () => PromotionVariantPrice, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, nullable: true})
@Connection('backlog', () => StockBackLog, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, nullable: true})
export class ProductVariantPrice extends BaseEntity {

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
    price: number;

    @FilterableField()
    @Column()
    taxIncluded: boolean;

    @Field(() => Hsn)
    @ManyToOne(() => Hsn, hsn => hsn.price)
    hsn: Hsn

    @Field(() => TaxRate)
    @ManyToOne(() => TaxRate, tax => tax.variants)
    tax: TaxRate

    @Field(() => ProductVariant)
    @ManyToOne(() => ProductVariant, variant => variant.price)
    variant: ProductVariant

    @Field(() => Store, {nullable: true})
    @ManyToOne(() => Store, store => store.prices)
    store: Store

    @Field(() => PromotionVariantPrice, {nullable: true})
    @OneToOne(() => PromotionVariantPrice, promoprice => promoprice.price)
    promoprice: PromotionVariantPrice

    @Field(() => CartItem, {nullable: true})
    @OneToMany(() => CartItem, item => item.price)
    cartItem: CartItem[]

    @Field(() => StockBackLog, {nullable: true})
    @OneToMany(() => StockBackLog, backlog => backlog.variant)
    backlog: StockBackLog[]

}
