import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {FilterableField} from '@nestjs-query/query-graphql';
import {ShippingMethodsEnum} from "../../enums/ShippingMethods";

registerEnumType(ShippingMethodsEnum, {
    name: 'ShippingMethodsEnum'
})

@ObjectType('ShippingMethod', {isAbstract: true})
@Entity({name: 'shippingMethod'})
export class ShippingMethod extends BaseEntity {
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
    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;

    @FilterableField()
    @Column({type: "enum", enum: ShippingMethodsEnum, default: ShippingMethodsEnum.DEFAULT})
    code: ShippingMethodsEnum;

    @FilterableField()
    @Column()
    description: number;

}
