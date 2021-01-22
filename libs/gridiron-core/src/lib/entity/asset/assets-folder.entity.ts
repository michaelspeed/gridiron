import {ID, ObjectType} from '@nestjs/graphql';
import {BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {FilterableField} from '@nestjs-query/query-graphql';
import {Asset} from './asset.entity';

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

    @OneToMany(type => Asset, asset => asset.folder)
    assets: Asset[]
}
