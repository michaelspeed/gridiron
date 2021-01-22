import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    JoinColumn, ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Field, ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {FilterableConnection, FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {OrderItem, OrderLine, User} from '..';
import {Payment} from "..";
import {PaymentModes} from "../../enums/PaymentModes";

registerEnumType(PaymentModes, {
    name: 'PaymentModes'
})

@ObjectType('Order', {isAbstract: true})
@Entity({name: 'order'})
@FilterableConnection('line', () => OrderLine, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'line'})
@Relation('user', () => User, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'user'})
@Relation('payment', () => Payment, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'payment', nullable: true})
export class Order extends BaseEntity {
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
    totalPrice: number;

    @FilterableField()
    @Column({type: 'text'})
    address: string

    @Field(() => PaymentModes)
    @Column({enum: PaymentModes, type: "enum", default: PaymentModes.cod})
    mode: PaymentModes

    @Field(() => [OrderLine])
    @OneToMany(() => OrderLine, item => item.order)
    line: OrderLine[]

    @ManyToOne(() => User, user => user.order)
    user: User

    @OneToOne(() => Payment, payment => payment.order)
    @JoinColumn()
    payment: Payment


}
