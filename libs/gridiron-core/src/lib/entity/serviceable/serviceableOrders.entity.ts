import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {FilterableField, FilterableRelation, PagingStrategies} from "@nestjs-query/query-graphql";
import {ID, ObjectType, registerEnumType} from "@nestjs/graphql";
import {OrderLine} from "../";

@ObjectType('ServiceableOrders', {isAbstract: true})
@Entity({name: 'serviceableorder'})
@FilterableRelation('orderLine', () => OrderLine, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'orderLine'})
export class ServiceableOrders extends BaseEntity {
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
    @Column({nullable: true})
    dateTime: Date

    @OneToOne(() => OrderLine, line => line.serviceable)
    orderLine: OrderLine
}
