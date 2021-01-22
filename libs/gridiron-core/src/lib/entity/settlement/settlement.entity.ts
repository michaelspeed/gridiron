import {ID, ObjectType, registerEnumType} from "@nestjs/graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {FilterableField, PagingStrategies, Relation} from "@nestjs-query/query-graphql";
import {Store} from "../Store/store.entity";
import {SettlementType} from "@gridiron/core/enums/SettlementType";

registerEnumType(SettlementType, {
    name: 'SettlementType'
})

@ObjectType('Settlements', {isAbstract: true})
@Relation('store', () => Store, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Entity('settlements')
export class Settlements extends BaseEntity {
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
    @Column({default: 0, type: "float"})
    amount: number;

    @FilterableField()
    @Column({default: 0, type: "float"})
    taxamount: number;

    @FilterableField()
    @Column({default: 0, type: "float"})
    finalamount: number;

    @FilterableField()
    @Column({default: ''})
    transactionID: string

    @FilterableField()
    @Column({default: ''})
    remarks: string

    @FilterableField(() => SettlementType)
    @Column({default: SettlementType.PROCESSING, enum: SettlementType, type: "enum"})
    type: SettlementType

    @ManyToOne(() => Store, store => store.settlement)
    store: Store
}
