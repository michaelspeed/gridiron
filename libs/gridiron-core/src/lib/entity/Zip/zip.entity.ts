import {ID, ObjectType} from '@nestjs/graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Connection, FilterableConnection, FilterableField, PagingStrategies} from '@nestjs-query/query-graphql';
import {Vendor, Store} from "..";

@ObjectType('Zip', {isAbstract: true})
@Entity({name: 'zip'})
@FilterableConnection('vendors', () => Vendor, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@FilterableConnection('store', () => Store, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class Zip extends BaseEntity {
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
    @Column({default: ''})
    name: string;

    @FilterableField()
    @Column({type: 'text'})
    slug: string;

    @FilterableField()
    @Column({unique: true})
    code: number;

    @ManyToMany(() => Vendor, vendor => vendor.zip)
    vendors: Vendor[]

    @ManyToMany(() => Store, store => store.zip)
    store: Store[]
}
