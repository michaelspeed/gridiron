import {Field, ID, ObjectType, registerEnumType} from "@nestjs/graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {FilterableField, FilterableRelation, PagingStrategies} from "@nestjs-query/query-graphql";
import {OrderLine, Store} from "..";
import {InvoiceEnum} from "../../enums";

registerEnumType(InvoiceEnum, {
    name: 'InvoiceEnum'
})

@ObjectType('Invoice', {isAbstract: true})
@Entity({name: 'invoice'})
@FilterableRelation('line', () => OrderLine, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'line'})
@FilterableRelation('store', () => Store, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'line'})
export class Invoice extends BaseEntity {

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

    // @Field(() => OrderLine)
    @ManyToOne(() => OrderLine, line => line.invoice)
    line: OrderLine

    // @Field(() => OrderLine)
    @ManyToOne(() => Store, store => store)
    store: Store

    @FilterableField(() => InvoiceEnum)
    @Column({type: "enum", enum: InvoiceEnum})
    type: InvoiceEnum

    @FilterableField()
    @Column({type: "float", default: 0})
    total: number

    @FilterableField()
    @Column({type: "float", default: 0})
    amount: number

    @FilterableField()
    @Column({type: "float", default: 0})
    fees: number

    @FilterableField()
    @Column({type: "float", default: 0})
    tax: number

    @FilterableField()
    @Column({default: false})
    nulled: boolean

}
