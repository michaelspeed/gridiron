import {Field, ID, ObjectType} from "@nestjs/graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity, JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {FilterableField, PagingStrategies, Relation} from "@nestjs-query/query-graphql";
import {Store, Vendor} from "@gridiron/core";

@ObjectType('Account', { isAbstract: true})
@Entity({name: 'account'})
@Relation('vendor', () => Vendor, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class Accounts extends BaseEntity {
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

    @Field()
    @Column("float", {default: 0})
    currentBalance: number

    @Field()
    @Column('float', {default: 0})
    totalVolumeBalance: number

    @OneToOne(() => Vendor, vendor => vendor.account)
    @JoinColumn()
    vendor: Vendor
}
