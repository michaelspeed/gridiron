import {ID, ObjectType} from '@nestjs/graphql';
import {
    BaseEntity,
    Column,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn} from 'typeorm';
import {FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {Vendor, VendorPlans} from '../';

@ObjectType('VendorLicense', {isAbstract: true})
@Entity({name: 'vendor-license'})
@Relation('vendor', () => Vendor, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('plans', () => VendorPlans, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class VendorLicense extends BaseEntity {
    @FilterableField(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string

    @FilterableField()
    @DeleteDateColumn()
    deletedAt?: Date;

    @FilterableField()
    @Column()
    tenureStart: Date;

    @FilterableField()
    @Column()
    tenureEnd: Date;

    @OneToOne(() => Vendor)
    vendor: Vendor

    @ManyToOne(() => VendorPlans, plan => plan.licences)
    plans: VendorPlans
}
