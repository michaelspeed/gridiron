import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, JoinTable, ManyToMany,
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
import {User} from '../user/user.entity';
import {Accounts, OrderLine, Serviceable, Store, VendorLicense, Zip} from '../';

@ObjectType('Vendor', {isAbstract: true})
@Entity({name: 'vendor'})
@Relation('user', () => User, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('license', () => VendorLicense, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('store', () => Store, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('account', () => Store, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('serviceable', () => Serviceable, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, nullable: true})
@FilterableConnection('zip', () => Zip, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class Vendor extends BaseEntity {
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
    vendorName: string;

    @FilterableField()
    @Column()
    phoneNumber: string;

    @FilterableField()
    @Column({ unique: true })
    email: string;

    @OneToOne(type => Store, store => store.vendor)
    @JoinColumn()
    store: Store

    @OneToOne(type => User, user => user.vendor)
    @JoinColumn()
    user: User

    @OneToOne(type => VendorLicense)
    @JoinColumn()
    license: VendorLicense

    @Field(() => Zip, {nullable: true})
    @ManyToMany(() => Zip, zip => zip.vendors)
    @JoinTable()
    zip: Zip[]

    @OneToOne(() => Accounts, account => account.vendor)
    account: Accounts

    @ManyToOne(() => Serviceable, service => service.vendors)
    serviceable: Serviceable
}
