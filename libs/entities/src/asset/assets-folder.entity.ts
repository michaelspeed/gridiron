import {ID, ObjectType} from '@nestjs/graphql';
import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {FilterableField} from '@nestjs-query/query-graphql';

@ObjectType('AssetFolder', {isAbstract: true})
@Entity({name: 'asset-folder'})
export class AssetsFolder extends BaseEntity {

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
    name: string;
}
