/*
import {Injectable} from '@nestjs/common';
import {ConfigService} from '../../config';
import {GraphQLResolveInfo} from 'graphql';
import {Session} from '../../entity';

@Injectable()
export class RequestContextService {
    constructor(
        private configService: ConfigService
    ) {}

    async fromRequest(
        req: Request,
        info?: GraphQLResolveInfo,
        session?: Session
    ): Promise<RequestContext> {
        const apiType = getApiType(info)
        const user = session && (session as AuthenticatedSession).user
        const isAuthorized = false
        const authorizedAsOwnerOnly = false
        return new RequestContext({
            apiType,
            session,
            isAuthorized,
            authorizationAsOwnerOnly
        })
    }
}
*/
