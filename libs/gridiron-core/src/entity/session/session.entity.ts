import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn} from 'typeorm';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import {FilterableField} from '@nestjs-query/query-graphql';

@Entity({name: 'session'})
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Session extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // @Index({ unique: true })
    @Column()
    token: string;

}
