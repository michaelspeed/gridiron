import {
    BaseEntity, Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Field, ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {
    FilterableConnection,
    FilterableField,
    FilterableRelation,
    PagingStrategies,
    Relation
} from '@nestjs-query/query-graphql';
import {
    DeliveryPool,
    Invoice,
    Order,
    OrderItem,
    ProductVariant,
    Refund,
    ServiceableOrders,
    Store,
    TaxCategory,
    Vendor
} from '..';
import GraphQLJSON from "graphql-type-json";
import {OrderStageType} from "@gridiron/core/enums";

registerEnumType(OrderStageType, {
    name: 'OrderStageType'
})

@ObjectType('OrderLine', {isAbstract: true})
@Entity({name: 'order-line'})
@Relation('order', () => Order, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('item', () => OrderItem, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@FilterableRelation('store', () => Store, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'store'})
@FilterableRelation('pool', () => DeliveryPool, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'pool'})
@FilterableRelation('refund', () => Refund, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'refund'})
@FilterableRelation('serviceable', () => ServiceableOrders, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'serviceable'})
@FilterableConnection('invoice', () => Invoice, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'invoice'})
export class OrderLine extends BaseEntity {

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

    @Field(() => GraphQLJSON)
    @Column("simple-json")
    priceField: JSON

    @FilterableField(() => OrderStageType)
    @Column({type: "enum", enum: OrderStageType, default: OrderStageType.CREATED})
    stage: OrderStageType

    @ManyToOne(() => Order, order => order.line)
    order: Order

    @Field(() => OrderItem)
    @OneToOne(() => OrderItem, item => item)
    @JoinColumn()
    item: OrderItem

    @Field(() => Store)
    @ManyToOne(() => Store, vendor => vendor.line)
    store: Store

    @Field(() => [Invoice])
    @ManyToOne(() => Invoice, invoice => invoice.line)
    invoice: Invoice[]

    @ManyToOne(() => DeliveryPool, pool => pool.lines)
    pool: DeliveryPool

    @Field(() => Refund)
    @OneToOne(() => Refund, refund => refund.line)
    @JoinColumn()
    refund: Refund

    @Field(() => ServiceableOrders)
    @OneToOne(() => ServiceableOrders, service => service.orderLine)
    @JoinColumn()
    serviceable: ServiceableOrders
}
