import {ChildEntity, ManyToOne} from 'typeorm';
import { User } from '../user/user.entity';
import {Session} from './session.entity';

@ChildEntity()
export class AuthenticatedSession extends Session {

    @ManyToOne(() => User)
    user: User;

}
