import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {ID, ObjectType} from '@nestjs/graphql';
import {Connection, FilterableField, PagingStrategies} from '@nestjs-query/query-graphql';
import { TaxRate } from '../tax-rate/tax-rate.entity';
import { Store } from '../Store/store.entity';

@ObjectType('TaxCategory', {isAbstract: true})
@Entity({name: 'taxCategory'})
@Connection('rate', () => TaxRate, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class TaxCategory extends BaseEntity {
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
    name: string;

    @ManyToOne(() => Store, store => store.taxCategory)
    store: Store

    @OneToMany(() => TaxRate, rate => rate.category)
    rate: TaxRate[]
}
