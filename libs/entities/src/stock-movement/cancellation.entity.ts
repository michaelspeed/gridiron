import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {ID, ObjectType} from '@nestjs/graphql';
import {FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import { StockKeeping } from './stock-keeping.entity';

@ObjectType('Cancellation', {isAbstract: true})
@Entity({name: 'cancellation'})
@Relation('keeping', () => StockKeeping, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class Cancellation extends BaseEntity {
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
    quantity: number;

    @ManyToOne(() => StockKeeping, keeping => keeping.cancels)
    keeping: StockKeeping
}
