import {ID, ObjectType} from "@nestjs/graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {FilterableField, PagingStrategies, Relation} from "@nestjs-query/query-graphql";
import {Store} from "./store.entity";

@ObjectType('StoreBalance', {isAbstract: true})
@Relation('store', () => Store, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Entity('storebalance')
export class StoreBalance extends BaseEntity {
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
    @Column({default: 0, type: "float"})
    balance: number;

    @FilterableField()
    @Column({default: 0, type: "float"})
    balanceVolume: number;

    @OneToOne(type1 => Store, store => store.balance)
    store: Store
}
