import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {Connection, FilterableField, PagingStrategies} from '@nestjs-query/query-graphql';
import {Store, Zone} from '..';

export enum CountryZone {
    ASIA = 'ASIA',
    EUROPE = 'EUROPE',
    AFRICA = 'AFRICA',
    'OCEANIA' = 'OCEANIA',
    'AMERICAS' = 'AMERICAS'
}

registerEnumType(CountryZone, {
    name: 'CountryZone'
})

@ObjectType('Country', {isAbstract: true})
@Entity({name: 'country'})
@Connection('zone', () => Zone, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('stores', () => Store, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class Country extends BaseEntity {
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
    @Column()
    code: string;

    @FilterableField()
    @Column()
    name: string;

    @FilterableField()
    @Column()
    enabled: boolean;

    @ManyToMany(type => Zone, zone => zone.members)
    zone: Zone[];

    @OneToMany(type => Store, store => store.country)
    stores: Store[]
}
