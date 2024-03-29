import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity, JoinColumn,
    ManyToOne, OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import {
    Connection,
    FilterableConnection,
    FilterableField,
    PagingStrategies,
    Relation
} from '@nestjs-query/query-graphql';
import { Product } from '../product/product.entity';
import { ProductVariantAsset } from './product-variant-asset.entity';
import { ProductVariantPrice } from './product-variant-price.entity';
import { BillingAgreement } from '../billing-agreement/BillingAgreement';
import { ProductVariantSpecifications } from './product-variant-specifications.entity';
import { Seo } from '../Seo/Seo.entity';
import { StockKeeping } from '../stock-movement/stock-keeping.entity';
import { OrderItem } from '../order-item/order-item.entity';
import { View } from '../view/view.entity';
import { CartItem } from '../cart/cartItem.entity';
import { Review } from '../reviews/review.entity';

@ObjectType('ProductVariant', {isAbstract: true})
@Entity({name: 'productVariant'})
@Relation('product', () => Product, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('asset', () => ProductVariantAsset, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@FilterableConnection('price', () => ProductVariantPrice, {relationName: 'price' ,nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, allowFiltering: false})
@FilterableConnection('agreements', () => BillingAgreement, {relationName: 'agreements' ,nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, allowFiltering: false})
@Relation('specs', () => ProductVariantSpecifications, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('seo', () => Seo, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('stock', () => StockKeeping, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@FilterableConnection('line', () => OrderItem, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class ProductVariant extends BaseEntity {
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
    @Column({default: 0})
    dum_price: number

    @FilterableField()
    @Column({ default: true })
    enabled: boolean;

    @FilterableField()
    @Column({default: ''})
    sku: string;

    @FilterableField()
    @Column()
    name: string;

    @FilterableField()
    @Column({default: 0})
    rating: number;

    @Field(() => Product)
    @ManyToOne(() => Product, prod => prod.variants)
    product: Product

    @FilterableField()
    @Column({default: true})
    trackInventory: boolean;

    @Field(() => ProductVariantAsset, {nullable: true})
    @OneToOne(() => ProductVariantAsset, prod => prod.variant)
    asset: ProductVariantAsset

    @Field(() => [ProductVariantPrice], {nullable: true})
    @OneToMany(() => ProductVariantPrice, price => price.variant)
    price: ProductVariantPrice[]

    @Field(() => ProductVariantSpecifications, {nullable: true})
    @OneToOne(() => ProductVariantSpecifications, specs => specs.variant)
    @JoinColumn()
    specs: ProductVariantSpecifications

    @OneToMany(() => View, view => view.variant)
    view: View[]

    @Field(() => Seo,{nullable: true})
    @OneToOne(() => Seo, seo => seo.variant)
    seo: Seo

    @Field(() => [BillingAgreement])
    @OneToMany(() => BillingAgreement, agreement => agreement.variant)
    agreements: BillingAgreement[]

    @Field(() => [StockKeeping])
    @OneToMany(() => StockKeeping, keeping => keeping.variant)
    stock: StockKeeping[]

    @Field(() => [OrderItem])
    @OneToMany(() => OrderItem, line => line.productVariant)
    line: OrderItem[]

    @Field(() => [CartItem])
    @OneToMany(() => CartItem, cart => cart.variant)
    carts: CartItem[]

    @Field(() => [Review])
    @OneToMany(() => Review, rev => rev.variant)
    reviews: Review[]

    @Field(() => [String])
    @Column("simple-array")
    viewcode: string[]

}
