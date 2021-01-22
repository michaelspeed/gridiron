import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity, JoinColumn,
    JoinTable,
    ManyToMany,
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
import {
    BillingAgreement, CartItem,
    OrderItem,
    OrderLine,
    Product,
    ProductOption,
    ProductVariantAsset,
    ProductVariantPrice,
    ProductVariantSpecifications,
    Seo,
    View,
    StockKeeping, Review
} from '../';

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
    @ManyToOne(type => Product, prod => prod.variants)
    product: Product

    @FilterableField()
    @Column({default: true})
    trackInventory: boolean;

    @Field(() => ProductVariantAsset, {nullable: true})
    @OneToOne(type => ProductVariantAsset, prod => prod.variant)
    asset: ProductVariantAsset

    @Field(() => [ProductVariantPrice], {nullable: true})
    @OneToMany(type => ProductVariantPrice, price => price.variant)
    price: ProductVariantPrice[]

    @Field(() => ProductVariantSpecifications, {nullable: true})
    @OneToOne(type => ProductVariantSpecifications, specs => specs.variant)
    @JoinColumn()
    specs: ProductVariantSpecifications

    @OneToMany(type => View, view => view.variant)
    view: View[]

    @Field(() => Seo,{nullable: true})
    @OneToOne(type => Seo, seo => seo.variant)
    seo: Seo

    @Field(() => [BillingAgreement])
    @OneToMany(type => BillingAgreement, agreement => agreement.variant)
    agreements: BillingAgreement[]

    @Field(() => [StockKeeping])
    @OneToMany(() => StockKeeping, keeping => keeping.variant)
    stock: StockKeeping[]

    @Field(() => [OrderItem])
    @OneToMany(() => OrderItem, line => line.productVariant)
    line: OrderItem[]

    @Field(() => [CartItem])
    @OneToMany(type => CartItem, cart => cart.variant)
    carts: CartItem[]

    @Field(() => [Review])
    @OneToMany(() => Review, rev => rev.variant)
    reviews: Review[]

    @Field(() => [String])
    @Column("simple-array")
    viewcode: string[]

}
