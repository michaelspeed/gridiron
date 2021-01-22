import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity, ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {ID, ObjectType} from '@nestjs/graphql';
import {FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {Order, PaymentMethod, User} from "..";

@ObjectType('Payment', {isAbstract: true})
@Entity({name: 'payment'})
@Relation('order', () => Order, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'order'})
export class Payment extends BaseEntity {
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
    amount: number;

    @FilterableField({nullable: true})
    @Column({ nullable: true })
    errorMessage: string;

    @FilterableField({nullable: true})
    @Column({ nullable: true })
    transactionId: string;

    @Column('simple-json') metadata: JSON;

    @OneToOne(() => Order, order => order.payment)
    order: Order

    @ManyToOne(() => PaymentMethod, method => method.transactions, {nullable: true})
    method: PaymentMethod
}
