import {Field, ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinColumn, JoinTable, ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {
    Connection,
    FilterableConnection,
    FilterableField,
    PagingStrategies,
    Relation
} from '@nestjs-query/query-graphql';
import { Country } from '../country/country.entity';
import { StoreBalance } from './storeBalance.entity';
import { Asset } from '../asset/asset.entity';
import { StockKeeping } from '../stock-movement/stock-keeping.entity';
import { Settlements } from '../settlement/settlement.entity';
import { ProductVariantPrice } from '../product-variant/product-variant-price.entity';
import { CartItem } from '../cart/cartItem.entity';
import { StockBackLog } from '../stock-movement/stock-back-log.entity';
import { Zip } from '../Zip/zip.entity';
import { Invoice } from '../invoice/Invoice.entity';
import { Zone } from '../zone/zone.entity';
import { TaxCategory } from '../tax-category/tax-category.entity';
import { Vendor } from '../vendor/vendor.entity';
import { BillingAgreement } from '../billing-agreement/BillingAgreement';
import { OrderLine } from '../order-line/order-line.entity';

export enum StoreTypeEnum {
    DEFAULT = 'default',
    VENDOR = 'vendor'
}

registerEnumType(StoreTypeEnum, {
    name: 'StoreTypeEnum',
});

@ObjectType('Store', {isAbstract: true})
@Relation('country', () => Country, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('balance', () => StoreBalance, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, nullable: true})
@Relation('logo', () => Asset, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, nullable: true})
@Connection('sku', () => StockKeeping, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@FilterableConnection('settlement', () => Settlements, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'settlement'})
@Connection('prices', () => ProductVariantPrice, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@FilterableConnection('cart', () => CartItem, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@FilterableConnection('backlogs', () => StockBackLog, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@FilterableConnection('zip', () => Zip, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'zip'})
@FilterableConnection('invoices', () => Invoice, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'invoices'})
@Entity({name: 'store'})
export class Store extends BaseEntity {
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
    @Column()
    storeName: string;

    @FilterableField()
    @Column()
    phoneNumber: string;

    @FilterableField()
    @Column({ unique: true })
    officialemail: string;

    @ManyToOne(() => Zone, zone => zone.stores)
    region: Zone;

    @FilterableField()
    @Column()
    zipcode: string;

    @FilterableField()
    @Column()
    streetAddress1: string;

    @FilterableField()
    @Column()
    streetAddress2: string;

    @FilterableField()
    @Column({default: ''})
    GSTIN: string;

    @FilterableField()
    @Column({default: true})
    singleStore: boolean;

    @FilterableField()
    @Column({default: false})
    rentalStore: boolean;

    @FilterableField()
    @Column({default: false})
    channelMarkets: boolean;

    @FilterableField()
    @Column({default: false})
    services: boolean;

    @FilterableField()
    @Column()
    assetAPI: string;

    @FilterableField()
    @Column()
    mainAPI: string;

    @Field(() => StoreTypeEnum)
    @Column({enum: StoreTypeEnum, type: "enum", default: StoreTypeEnum.DEFAULT})
    type: StoreTypeEnum

    @ManyToOne(() => Country, count => count.stores)
    country: Country

    @OneToMany(() => TaxCategory, taxc => taxc.store)
    taxCategory: TaxCategory[]

    @Field(() => Vendor, {nullable: true})
    @OneToOne(() => Vendor, vendor => vendor.store)
    vendor: Vendor

    @OneToOne(() => StoreBalance, balance => balance.store)
    @JoinColumn()
    balance: StoreBalance

    @Field(() => Asset)
    @OneToOne(() => Asset, asset => asset.store)
    @JoinColumn()
    logo: Asset

    @OneToMany(() => BillingAgreement, agreement => agreement.store)
    agreement: BillingAgreement[]

    @OneToMany(() => StockKeeping, sku => sku.store)
    sku: StockKeeping[]

    @OneToMany(() => Settlements, settle => settle.store)
    settlement: Settlements[]

    @OneToMany(() => ProductVariantPrice, price => price.store)
    prices: ProductVariantPrice[]

    @OneToMany(() => OrderLine, line => line.store)
    line: OrderLine[]

    @Field(() => [CartItem])
    @OneToMany(() => CartItem, item => item.store)
    cart: CartItem[]

    @Field(() => StockBackLog)
    @OneToMany(() => StockBackLog, backlog => backlog.store)
    backlogs: StockBackLog[]

    @Field(() => Zip, {nullable: true})
    @ManyToMany(() => Zip, zip => zip.store)
    @JoinTable()
    zip: Zip[]

    @OneToMany(() => Invoice, invoice => invoice.store)
    invoices: Invoice[]
}
