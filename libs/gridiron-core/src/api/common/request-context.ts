/*
import {AuthenticatedSession, Session, User} from '../../entity';
import {ApiType} from './get-api-type';
import {ID, JsonCompatible} from '../../common';

export type SerializedRequestContext = {
    _session: JsonCompatible<Session> & {
        user: JsonCompatible<User>
    };
    _apiType: ApiType;
    _isAuthorized: boolean;
    _authorizationAsOwnerOnly: boolean
}

export class RequestContext {
    private readonly _session?: Session
    private readonly _isAuthorized: boolean
    private readonly _authorizationAsOwnerOnly: boolean
    private readonly _apiType: ApiType

    constructor(
        options: {
            apiType: ApiType,
            session?: Session,
            isAuthorized: boolean,
            authorizationAsOwnerOnly: boolean
        }
    ) {
        const {apiType, session} = options
        this._apiType = apiType
        this._session = session
        this._isAuthorized = options.isAuthorized
        this._authorizationAsOwnerOnly = options.authorizationAsOwnerOnly
    }

    static deserialize(ctxObject: SerializedRequestContext): RequestContext {
        let session: Session | undefined
        if (ctxObject._session) {
            const user = new User(ctxObject._session.user)
            session = new AuthenticatedSession({
                ...ctxObject._session,
                user
            })
        } else {
            session = new AnonymousSession(ctxObject._session)
        }
        return new RequestContext({
            apiType: ctxObject._apiType,
            session,
            isAuthorized: ctxObject._isAuthorized,
            authorizationAsOwnerOnly: ctxObject._authorizationAsOwnerOnly
        })
    }

    serialize(): SerializedRequestContext {
        return JSON.parse(JSON.stringify(this))
    }

    get apiType(): ApiType {
        return this._apiType
    }

    get session(): Session | undefined {
        return this._session
    }

    get activeUserId(): ID | undefined {
        const user = this.activeUser
        if (user) {
            return user.id
        }
    }

    get isAuthorized(): boolean {
        return this._isAuthorized
    }

    get authorizedAsOwnerOnly(): boolean {
        return this._authorizationAsOwnerOnly
    }

    get activeUser(): User | undefined {
        if (this.session) {
            if (this.isAuthenticatedSession(this.session)) {
                return this.session.user
            }
        }
    }

    private isAuthenticatedSession(session: Session): session is AuthenticatedSession {
        return session.hasOwnProperty('user')
    }
}
*/
