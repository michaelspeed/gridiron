import {Field, ID, ObjectType} from "@nestjs/graphql";
import {
    BaseEntity,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {FilterableField} from "@nestjs-query/query-graphql";
import {DeliverySignIn, OrderLine} from "../../entity";

@ObjectType('DeliveryPool', {isAbstract: true})
@Entity({name: 'deliverypool'})
export class DeliveryPool extends BaseEntity {
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

    @Field(() => DeliverySignIn)
    @OneToOne(() => DeliverySignIn, sign => sign.pool)
    signIn: DeliverySignIn

    @Field(() => [OrderLine])
    @OneToMany(() => OrderLine, line => line.pool)
    lines: OrderLine[]
}
