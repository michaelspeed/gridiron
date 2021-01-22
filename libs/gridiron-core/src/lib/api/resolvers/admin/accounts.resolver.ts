import {Context, Query, Resolver} from "@nestjs/graphql";
import {Accounts, Address} from "../../../entity";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";
import {AccountsService} from "../../../service";
import {JwtService} from "@nestjs/jwt";

@Resolver(() => Accounts)
export class AccountsResolver extends CRUDResolver(Accounts, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true,
    create: {
        disabled: true
    },
    delete: {
        disabled: true
    },
    update: {
        disabled: true
    }
}){
    constructor(
        @InjectQueryService(Accounts) readonly service: QueryService<Accounts>,
        private readonly accountsService: AccountsService,
        private readonly jwtService: JwtService,
    ) {
        super(service);
    }

    @Query(() => Accounts)
    async GetVendorAccount(
        @Context() context
    ): Promise<Accounts> {
        const auth = context.req.headers.authorization;
        const token = auth.split(' ')[1];
        const admin: any = this.jwtService.decode(token)
        return this.accountsService.GetAccountInfo(admin.userId)
    }
}
