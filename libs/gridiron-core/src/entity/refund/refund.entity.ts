import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {FilterableField, FilterableRelation, PagingStrategies} from '@nestjs-query/query-graphql';
import {OrderLine, Store} from "..";
import {RefundEnum} from "../../enums";

registerEnumType(RefundEnum, {
    name:'RefundEnum'
})

@ObjectType('Refund', {isAbstract: true})
@Entity({name: 'refund'})
@FilterableRelation('line', () => OrderLine, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'line'})
export class Refund extends BaseEntity {
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
    @Column({ nullable: true })
    reason: string;

    @FilterableField()
    @Column({ nullable: true })
    destination: string;

    @FilterableField()
    @Column({ nullable: true })
    transactionId: string;

    @FilterableField(() => RefundEnum)
    @Column({type: "enum", enum: RefundEnum, default: RefundEnum.INITIATED})
    stage: RefundEnum

    // @Field(() => OrderLine)
    @OneToOne(() => OrderLine, line => line.refund)
    line: OrderLine


}
