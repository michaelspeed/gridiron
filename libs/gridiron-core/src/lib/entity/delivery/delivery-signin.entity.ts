import {Field, ID, ObjectType} from "@nestjs/graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity, JoinColumn,
    ManyToOne, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {FilterableField} from "@nestjs-query/query-graphql";
import {Delivery, DeliveryPool} from "../../entity";

@ObjectType('DeliverySignIn', {isAbstract: true})
@Entity({name: 'delivery-signin'})
export class DeliverySignIn extends BaseEntity {
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

    @Column({default: false})
    online: boolean

    @Field(() => Delivery)
    @ManyToOne(() => Delivery, delivery => delivery.signIn)
    delivery: Delivery

    @Field(() => DeliveryPool)
    @OneToOne(() => DeliveryPool, pool => pool.signIn)
    @JoinColumn()
    pool: DeliveryPool

}
