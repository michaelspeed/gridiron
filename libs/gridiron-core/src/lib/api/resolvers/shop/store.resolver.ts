import {Args, Context, Mutation, Query, registerEnumType, Resolver} from "@nestjs/graphql";
import {Store, View} from "../../../entity";
import {ShopStoreService} from "../../../service";
import {ViewEnum} from "../../../enums";

registerEnumType(ViewEnum, {
    name: 'ViewEnum'
})


@Resolver(() => Store)
export class ShopStoreResolver {
    constructor(
        private readonly storeService: ShopStoreService,
    ) {}

    @Query(() => Store, {nullable: true})
    async GetDefaultStore(): Promise<Store> {
        return this.storeService.GetDefaultStore()
    }

    @Mutation(() => View)
    async createView(
        @Args('id') id: string,
        @Args('variant', {type: () => ViewEnum}) variant: ViewEnum,
        @Context() context
    ): Promise<View> {
        let user
        const auth = context.req.headers.authorization;
        if (auth) {
            const token = auth.split(' ')[1];
            const decoded = await this.storeService.DecryptToken(token)
            if (decoded) {
                user = decoded.userId
            }
        }
        const slug = JSON.stringify(context.req.rawHeaders)
        return this.storeService.createViews(slug, id, variant, user)

    }
}
