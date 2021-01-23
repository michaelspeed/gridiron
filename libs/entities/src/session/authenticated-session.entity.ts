import {ChildEntity, ManyToOne} from 'typeorm';
import {Session} from './session.entity';
import {User} from '../';

@ChildEntity()
export class AuthenticatedSession extends Session {

    @ManyToOne(() => User)
    user: User;

}
