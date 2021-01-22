import {BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Country} from '../country/country.entity';
import {Connection, FilterableField, PagingStrategies} from '@nestjs-query/query-graphql';
import {ID, ObjectType} from '@nestjs/graphql';
import {Store, TaxRate} from '..';

@ObjectType('Zone', {isAbstract: true})
@Connection('taxrates', () => TaxRate, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('stores', () => Store, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('members', () => Country, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Entity({name: 'zone'})
export class Zone extends BaseEntity {
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

    @ManyToMany(type => Country, count => count.zone)
    @JoinTable()
    members: Country[];

    @OneToMany(type => TaxRate, rate => rate.zone)
    taxrates: TaxRate[]

    @OneToMany(type => Store, store => store.region)
    stores: Store[]
}
