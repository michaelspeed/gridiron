import {Field, ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Connection, FilterableField, PagingStrategies} from '@nestjs-query/query-graphql';
import {VendorPlanPrice, VendorPlanTenure} from '../../enums/VendorPlan';
import {VendorLicense} from './vendor-license';

registerEnumType(VendorPlanPrice, {
    name: 'VendorPlanPrice'
})

registerEnumType(VendorPlanTenure, {
    name: 'VendorPlanTenure'
})

@ObjectType('VendorPlans', {isAbstract: true})
@Entity({name: 'vendor-plans'})
@Connection('licences', () => VendorLicense, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class VendorPlans extends BaseEntity {
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
    @Column({default: false})
    isActive: boolean;

    @FilterableField()
    @Column()
    name: string;

    @FilterableField()
    @Column({default: 0, type: 'float'})
    planValue: number

    @Field(() => String)
    @Column({type: 'enum', enum: VendorPlanPrice, default: VendorPlanPrice.FLAT})
    priceStrategy: VendorPlanPrice

    @Field(() => VendorPlanTenure)
    @Column({type: 'enum', enum: VendorPlanTenure, default: VendorPlanTenure.ANNUAL})
    tenureStrategy: VendorPlanTenure

    @OneToMany(type => VendorLicense, license => license.plans)
    licences: VendorLicense[]
}
