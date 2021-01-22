import {Field, ID, ObjectType} from "@nestjs/graphql";
import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";
import {FilterableField} from "@nestjs-query/query-graphql";

@ObjectType('DeliveryStranded', {isAbstract: true})
@Entity({name: 'delivery-stranded'})
export class DeliveryStranded extends BaseEntity {

    @FilterableField(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @FilterableField()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @Column()
    orderId: string
}
