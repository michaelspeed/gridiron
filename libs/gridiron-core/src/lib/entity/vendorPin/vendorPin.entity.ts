import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {FilterableField} from '@nestjs-query/query-graphql';
import {ID, ObjectType} from '@nestjs/graphql';

@ObjectType('VendorPin', {isAbstract: true})
@Entity({name: 'vendor-pin'})
export class VendorPin extends BaseEntity {
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
    @Column()
    deliveryPin: string;
}
