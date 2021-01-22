import {BaseEntity, ChildEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {ID, ObjectType} from '@nestjs/graphql';
import {FilterableField} from '@nestjs-query/query-graphql';
import {Session} from './session.entity';
import {User} from '../';

@ChildEntity()
export class AuthenticatedSession extends Session {

    @ManyToOne(type => User)
    user: User;

}
