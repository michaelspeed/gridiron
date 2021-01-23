import {Field, ID, ObjectType} from "@nestjs/graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {FilterableField, FilterableRelation, PagingStrategies, Relation} from "@nestjs-query/query-graphql";
import {ProductVariantPrice, Store} from "..";

@ObjectType('StockBackLog', {isAbstract: true})
@Entity({name: 'stock-back-log'})
@FilterableRelation('variant', () => ProductVariantPrice, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, nullable: true})
@FilterableRelation('store', () => Store, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, nullable: true})
export class StockBackLog extends BaseEntity {

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
    @Column({default: 0})
    quantity: number;

    // @Field(() => ProductVariantPrice)
    @ManyToOne(() => ProductVariantPrice, prodvar => prodvar.backlog)
    variant: ProductVariantPrice

    // @Field(() => Store)
    @ManyToOne(() => Store, store => store.backlogs)
    store: Store
}
