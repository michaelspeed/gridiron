import {Field, ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {Connection, FilterableField, FilterableRelation, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { BillingAgreementEnum, BillingAgreementState, Collection, ProductVariant, Store, BillingAgreementRequest } from '..';

registerEnumType(BillingAgreementEnum, {
    name: 'BillingAgreementEnum'
})

registerEnumType(BillingAgreementState, {
    name: 'BillingAgreementState'
})

@ObjectType('BillingAgreement', {isAbstract: true})
@Entity('billing-agreement')
@Relation('collection', () => Collection, {nullable: true,pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@FilterableRelation('variant', () => ProductVariant, {nullable: true,pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'variant'})
@FilterableRelation('store', () => Store, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('request', () => BillingAgreementRequest, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class BillingAgreement extends BaseEntity {

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
    @Column({default: 0, type: 'float'})
    value: number

    @Field(() => BillingAgreementEnum)
    @Column({type: 'enum', enum: BillingAgreementEnum})
    type: BillingAgreementEnum

    @Field(() => BillingAgreementState)
    @Column({type: 'enum', enum: BillingAgreementState})
    state: BillingAgreementState

    @Field(() => ProductVariant)
    @ManyToOne(() => ProductVariant, variant => variant.agreements)
    variant: ProductVariant

    @Field(() => Collection, {nullable: true})
    @ManyToOne(() => Collection, collect => collect.agreements)
    collection: Collection

    @Field(() => Store)
    @ManyToOne(() => Store, store => store.agreement)
    store: Store

    @Field(() => [BillingAgreementRequest])
    @OneToMany(() => BillingAgreementRequest, request => request.agreement)
    request: BillingAgreementRequest[]
}
