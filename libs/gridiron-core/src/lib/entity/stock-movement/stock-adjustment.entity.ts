import {BaseEntity, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {ID, ObjectType} from '@nestjs/graphql';
import {FilterableField} from '@nestjs-query/query-graphql';

@ObjectType('StockAdjustment', {isAbstract: true})
@Entity({name: 'stockAdjustment'})
export class StockAdjustment extends BaseEntity {
    @FilterableField(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @FilterableField()
    @CreateDateColumn()
    createdAt: Date;

    @FilterableField()
    @UpdateDateColumn()
    updatedAt: Date;
}
