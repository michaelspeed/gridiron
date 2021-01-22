import {BaseEntity, ChildEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {ID, ObjectType} from '@nestjs/graphql';
import {FilterableField} from '@nestjs-query/query-graphql';
import {DeepPartial} from '@gridiron/core/common';
import {Session} from './session.entity';

@ChildEntity()
export class AnonymousSession extends Session {

    @Column()
    sessionId: string
}
