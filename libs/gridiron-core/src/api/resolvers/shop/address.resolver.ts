import {Args, Context, ID, Mutation, Query, Resolver} from "@nestjs/graphql";
import {Address} from "../../../entity";
import {ShopAddressService} from "../../../service";
import {AddressType} from "../../../enums/AddressType";

@Resolver(() => Address)
export class ShopAddressResolver {
    constructor(
        private readonly shopAddressService: ShopAddressService
    ) {}

    @Query(() => [Address])
    async GetUserAddress(
        @Context() context
    ): Promise<Address[]> {
        const auth = context.req.headers.authorization;
        const token = auth.split(' ')[1];
        return this.shopAddressService.getAllUserAddress(token)
    }

    @Mutation(() => Address)
    async CreateNewAddress(
        @Args('fullName') fullName: string,
        @Args('addressLine') addressLine: string,
        @Args('city') city: string,
        @Args('state') state: string,
        @Args('landmark') landmark: string,
        @Args('postalCode') postalCode: string,
        @Args('phoneNumber') phoneNumber: string,
        @Args('type', {type:() => AddressType}) type: AddressType,
        @Context() context
    ): Promise<Address> {
        const auth = context.req.headers.authorization;
        const token = auth.split(' ')[1];
        return this.shopAddressService.createNewAddress(fullName, addressLine, city, state, landmark, postalCode, phoneNumber, type, token)
    }

    @Mutation(() => Address)
    async UpdateNewAddress(
        @Args('fullName') fullName: string,
        @Args('addressLine') addressLine: string,
        @Args('city') city: string,
        @Args('state') state: string,
        @Args('landmark') landmark: string,
        @Args('postalCode') postalCode: string,
        @Args('phoneNumber') phoneNumber: string,
        @Args('type', {type:() => AddressType}) type: AddressType,
        @Args('id', {type: () => ID}) id: string,
        @Context() context
    ): Promise<Address> {
        const auth = context.req.headers.authorization;
        const token = auth.split(' ')[1];
        return this.shopAddressService.updateNewAddress(fullName, addressLine, city, state, landmark, postalCode, phoneNumber, type, token, id)
    }
}
