import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {FilterableField} from '@nestjs-query/query-graphql';
import {ID, ObjectType} from '@nestjs/graphql';

@ObjectType('GlobalSettings', {isAbstract: true})
@Entity({name: 'global-settings'})
export class GlobalSettings extends BaseEntity {
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
    @Column({ default: false })
    trackInventory: boolean;

}
