import {Field, ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Connection, FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {Cancellation, ProductVariant, Sale, StockMovement, Store,} from '..';
import {StockKeepingType} from '@gridiron/core/enums/StockKeepingType';

registerEnumType(StockKeepingType, {
    name: 'StockKeepingType'
})

@ObjectType('StockKeeping', {isAbstract: true})
@Entity({name: 'StockKeeping'})
@Relation('variant', () => ProductVariant, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('store', () => Store, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('movement', () => StockMovement, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('cancels', () => Cancellation, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('sale', () => Sale, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class StockKeeping extends BaseEntity {
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
    quantity: number;

    @FilterableField()
    @Column()
    available_quantity: number;

    @FilterableField()
    @Column()
    threshold: number;

    @FilterableField()
    @Column()
    multiple: boolean;

    @FilterableField()
    @Column()
    backorder: boolean;

    @FilterableField()
    @Column({default: true})
    stockstatus: boolean;

    @FilterableField()
    @Column()
    sku: string

    @FilterableField(() => StockKeepingType)
    @Column({enum: StockKeepingType, type: 'enum', default: StockKeepingType.VENDOR})
    type: StockKeepingType

    @Field(() => ProductVariant)
    @ManyToOne(() => ProductVariant, variant => variant.stock)
    variant: ProductVariant

    @ManyToOne(() => Store, store => store.sku)
    store: Store

    @OneToMany(() => StockMovement, movement => movement.keeping)
    movement: StockMovement[]

    @OneToMany(() => Cancellation, cancel => cancel.keeping)
    cancels: Cancellation[]

    @OneToMany(() => Sale, sale => sale.keeping)
    sale: Sale[]
}
