import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, JoinTable, ManyToMany,
    ManyToOne, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import {
    FilterableConnection,
    FilterableField,
    PagingStrategies,
    Relation
} from '@nestjs-query/query-graphql';
import {User} from '../user/user.entity';
import { VendorLicense } from '../plans/vendor-license';
import { Store } from '../Store/store.entity';
import { Serviceable } from '../serviceable/serviceable.entity';
import { Zip } from '../Zip/zip.entity';
import { Accounts } from '../Accounts/accounts.entity';

@ObjectType('Vendor', {isAbstract: true})
@Entity({name: 'vendor'})
@Relation('user', () => User, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('license', () => VendorLicense, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('store', () => Store, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('account', () => Accounts, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
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

    @OneToOne(() => Store, store => store.vendor)
    @JoinColumn()
    store: Store

    @OneToOne(() => User, user => user.vendor)
    @JoinColumn()
    user: User

    @OneToOne(() => VendorLicense)
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
