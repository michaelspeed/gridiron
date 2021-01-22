import {Args, Context, ID, Mutation, Query, Resolver} from "@nestjs/graphql";
import {ResetCode, User} from "../../../entity";
import {UserResponse} from "../../dto/shop/UserResponse";
import {ShopUserService} from "../../../service/services/shop/user.service";

@Resolver(() => User)
export class ShopUserResolver {
    constructor(
        private readonly userService: ShopUserService
    ) {}

    @Mutation(() => UserResponse)
    async CreateUser(
        @Args('email') email: string,
        @Args('password') password: string,
        @Args('phone') phone: string,
        @Args('fname') fname: string,
        @Args('lname') lname: string,
    ): Promise<UserResponse> {
        return this.userService.CreateUser(email, password, phone, fname, lname)
    }

    @Mutation(() => UserResponse)
    async LoginUser(
        @Args('email') email: string,
        @Args('password') password: string,
    ): Promise<UserResponse> {
        return this.userService.LoginUser(email, password)
    }

    @Query(() => User)
    async GetCurrentUser(
        @Context() context
    ): Promise<User> {
        return new Promise(async (resolve, reject) => {
            const auth = context.req.headers.authorization;
            const token = auth.split(' ')[1];
            this.userService.getUserId(token).then(value => resolve(value)).catch(error => reject(error))
        })
    }

    @Mutation(() => User)
    async UpdateAccountInfo(
        @Args('phone') phone: string,
        @Args('fname') fname: string,
        @Args('lname') lname: string,
        @Context() context
    ): Promise<User> {
        const auth = context.req.headers.authorization;
        const token = auth.split(' ')[1];
        return this.userService.updateAccountInfo(fname, lname, phone, token)
    }

    @Mutation(() => ResetCode)
    async RequestResetCode(
        @Args('email') email: string,
    ): Promise<ResetCode> {
        return this.userService.resetPassword(email)
    }
}
