import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index, JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import {Connection, FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {Address, Administrator, Cart, Delivery, Order, ResetCode, Review, Vendor, View} from '..';

@ObjectType('User', {isAbstract: true})
@Relation('administrator', () => Administrator, {nullable: true})
@Relation('vendor', () => Vendor, {nullable: true})
@Relation('delivery', () => Delivery, {nullable: true})
@Connection('address', () => Address, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, nullable: true, relationName: 'address'})
@Connection('order', () => Order, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, nullable: true, relationName: 'order'})
@Entity({name: 'user'})
export class User extends BaseEntity {

    @FilterableField(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @FilterableField()
    @CreateDateColumn()
    createdAt: Date;

    @FilterableField()
    @UpdateDateColumn()
    updatedAt: Date;

    @Index()
    @FilterableField()
    @Column()
    email: string;

    @Column()
    password: string;

    @FilterableField()
    @Column({ default: false })
    verified: boolean;

    @FilterableField({nullable: true})
    @Column({ type: 'varchar', nullable: true })
    verificationToken: string;

    @FilterableField({nullable: true})
    @Column({ type: 'varchar', nullable: true })
    passwordResetToken: string;

    @FilterableField({nullable: true})
    @Column({ type: 'varchar', nullable: true })
    identifierChangeToken: string;

    @FilterableField({nullable: true})
    @Column({ type: 'varchar', nullable: true })
    pendingIdentifier: string;

    @FilterableField({nullable: true})
    @Column({ nullable: true, type: "date" })
    lastLogin: Date;

    @FilterableField({nullable: true})
    @Column({nullable: true})
    firstName: string;

    @FilterableField({nullable: true})
    @Column({nullable: true})
    lastName: string;

    @Index()
    @FilterableField()
    @Column()
    phoneNumber: string;

    @Field(() => Administrator, {nullable: true})
    @OneToOne(type => Administrator, ad => ad.user)
    administrator: Administrator;

    @Field(() => Vendor, {nullable: true})
    @OneToOne(type => Vendor, vendor => vendor.user)
    vendor: Vendor

    @Field(() => Delivery, {nullable: true})
    @OneToOne(type => Delivery, delivery => delivery.user)
    @JoinColumn()
    delivery: Delivery

    @Field(() => Cart, {nullable: true})
    @OneToOne(() => Cart, cart => cart.user)
    cart: Cart

    @Field(() => [View])
    @OneToMany(() => View, view => view.user)
    view: View[]

    @Field(() => [Review])
    @OneToMany(() => Review, view => view.user)
    reviews: Review[]

    @Field(() => [Address], {nullable: true})
    @OneToMany(() => Address, add => add.user)
    address: Address[]

    @Field(() => [Order], {nullable: true})
    @OneToMany(() => Order, order => order.user)
    order: Order[]

    @Field(() => [ResetCode], {nullable: true})
    @OneToMany(() => ResetCode, reset => reset.user)
    reset: ResetCode[]
}
