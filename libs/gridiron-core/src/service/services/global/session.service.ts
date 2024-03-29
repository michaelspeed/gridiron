import { User, AuthenticatedSession } from '@gridiron/entities';
import {Injectable} from '@nestjs/common';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection} from 'typeorm';
import * as uniqid from 'uniqid';

@Injectable()
export class SessionService {
    constructor(
        @InjectConnection() private connection: Connection,
    ) {}

    async CreateAuthenticatedSession(user: User): Promise<AuthenticatedSession> {
        return new Promise(async (resolve, reject) => {
            const authSession = new AuthenticatedSession()
            authSession.user = user
            authSession.token = uniqid('session-')
            const savesession = await this.connection.getRepository(AuthenticatedSession).save(authSession)
            resolve(savesession)
        })
    }
}
