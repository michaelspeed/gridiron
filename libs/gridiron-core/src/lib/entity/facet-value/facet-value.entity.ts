import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import {Connection, FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {Facet} from '../facet/facet.entity';
import {Product} from '../';

@ObjectType('FacetValue', {isAbstract: true})
@Entity({name: 'facetValue'})
@Relation('facet', () => Facet, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('product', () => Product, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class FacetValue extends BaseEntity {
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

    @Field(() => [Product])
    @ManyToMany(type => Product, prod => prod.facets)
    product: Product[]

    @Field(() => Facet)
    @ManyToOne(type => Facet, fac => fac.values)
    facet: Facet

}
