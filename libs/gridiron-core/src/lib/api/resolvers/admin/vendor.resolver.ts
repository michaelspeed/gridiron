import {Args, Context, ID, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Vendor} from '../../../entity';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import {VendorService} from '../../../service';
import {VendorDto} from '@gridiron/core/api/dto/vendors/vendor.dto';
import {JwtService} from '@nestjs/jwt';

@Resolver(of => Vendor)
export class VendorResolver extends CRUDResolver(Vendor, {
    create: {
        disabled: true
    },
    update: {
        disabled: true
    },
    delete: {
        disabled: true
    },
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(Vendor) readonly service: QueryService<Vendor>,
        private readonly vendorService: VendorService,
        private readonly jwtService: JwtService,
    ) {
        super(service);
    }

    @Query(() => Vendor, {nullable: true})
    async GetVendorInfo(
        @Context() context
    ): Promise<Vendor | null> {
        const auth = context.req.headers.authorization;
        if (auth) {
            const token = auth.split(' ')[1];
            const admin: any = this.jwtService.decode(token)
            return this.vendorService.findOneVendor(admin.userId)
        } else {
            return new Promise((resolve, reject) => {reject('Unauthorized')})
        }
    }

    @Mutation(() => VendorDto)
    async LoginVendor(
        @Args('email') email: string,
        @Args('password') password: string,
    ): Promise<VendorDto> {
        return new Promise(async (resolve, reject) => {
            const all = await this.vendorService.onLoginVendor(email, password)
            const token = await this.vendorService.createVendorToken(all.user.id, all.vendor.id, all.session.id)
            resolve({
                user: all.user,
                token,
                vendor: all.vendor
            })
        })
    }

    @Mutation(() => VendorDto)
    async RegisterVendor(
        @Args('email') email: string,
        @Args('planID') planID: string,
        @Args('firstname') fname: string,
        @Args('lastname') lname: string,
        @Args('phone') phone: string,
        @Args('password') password: string,
        @Args('storeName') storeName: string,
        @Args('storeNumber') storeNumber: string,
        @Args('officialEmail') officialEmail: string,
        @Args('region', {type: () => ID!}) region: string,
        @Args('zipcode') zipcode: string,
        @Args('streetAddress1') streetAddress1: string,
        @Args('streetAddress2') streetAddress2: string,
        @Args('rentals') rentals: boolean,
    ): Promise<VendorDto> {
        return new Promise(async (resolve, reject) => {
            const all = await this.vendorService.registerVendor(email, fname, lname, phone, password, storeName, storeNumber, officialEmail, region, zipcode, streetAddress1, streetAddress2, rentals, planID)
            const token = await this.vendorService.createVendorToken(all.user.id, all.vendor.id, all.session.id)
            resolve({
                user: all.user,
                token,
                vendor: all.vendor
            })
        })
    }
}
