import {Field, ID, ObjectType} from '@nestjs/graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {FilterableField, FilterableRelation, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {BillingAgreement} from '..';
import {BillingAgreementState} from '../../enums';

@ObjectType('BillingAgreementRequest', {isAbstract: true})
@Entity('billing-agreement-request')
@FilterableRelation('agreement', () => BillingAgreement, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class BillingAgreementRequest extends BaseEntity {

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

    @Field(() => BillingAgreementState)
    @Column({type: 'enum', enum: BillingAgreementState, default: BillingAgreementState.PENDING})
    state: BillingAgreementState

    @ManyToOne(type => BillingAgreement, agreement => agreement.request)
    agreement: BillingAgreement
}
