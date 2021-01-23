import {ChildEntity, Column} from 'typeorm';
import {Session} from './session.entity';

@ChildEntity()
export class AnonymousSession extends Session {

    @Column()
    sessionId: string
}
