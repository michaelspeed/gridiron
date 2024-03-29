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
import {ID, ObjectType} from '@nestjs/graphql';
import {Connection, FilterableField, PagingStrategies} from '@nestjs-query/query-graphql';
import { FacetValue } from '../facet-value/facet-value.entity';
import { Product } from '../product/product.entity';

@ObjectType('Facet', {isAbstract: true})
@Entity({name: 'facet'})
@Connection('values', () => FacetValue, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('product', () => Product, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class Facet extends BaseEntity {

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
    name: string;

    @FilterableField()
    @Column({ default: false })
    isPrivate: boolean;

    @FilterableField()
    @Column({ unique: true })
    code: string;

    @OneToMany(() => FacetValue, val => val.facet)
    values: FacetValue[]

}
