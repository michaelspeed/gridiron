import {Args, Context, Mutation, Query, registerEnumType, Resolver} from '@nestjs/graphql';
import {Administrator, User} from '../../../entity';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {AdministratorDto, AdministratorResponseType} from '../../dto/admin/administrator.dto';
import {AdministratorService} from '../../../service/services/admin/administrator.service'
import {AdministratorEnum} from '../../../enums';
import {StoreService} from '../../../service';

registerEnumType(AdministratorResponseType, {
    name: 'AdministratorResponseType'
})

@Resolver(of => Administrator)
export class AdministratorResolver {

    constructor(
        private readonly administratorService: AdministratorService,
        private readonly jwtService: JwtService,
        private readonly storeService: StoreService
    ) {}

    @Mutation(() => AdministratorDto)
    async administratorLogin(
        @Args('email') email: string,
        @Args('password') password: string
    ): Promise<AdministratorDto> {
        return new Promise(async (resolve, reject) => {
            const user = await User.findOne({where: {email}, relations: ['administrator', 'vendor']})
            if (user) {
                const valid = await bcrypt.compare(password, user.password)
                if (valid) {
                    const token = await this.administratorService.createToken(user.id, user.administrator.id)
                    const defStore = await this.storeService.GetDefaultStore()
                    if (user.administrator && user.vendor) {
                        resolve({
                            user: user,
                            token,
                            store: defStore,
                            type: AdministratorResponseType.BOTH
                        })
                    } else if (user.vendor && !user.administrator) {
                        resolve({
                            user: user,
                            token,
                            store: defStore,
                            type: AdministratorResponseType.VENDOR
                        })
                    } else if (!user.vendor && user.administrator) {
                        resolve({
                            user: user,
                            token,
                            store: defStore,
                            type: AdministratorResponseType.ADMIN
                        })
                    } else if (!user.vendor && !user.administrator) {
                        resolve({
                            user: user,
                            token,
                            store: defStore,
                            type: AdministratorResponseType.BASIC
                        })
                    }
                    /*resolve({
                        user: user,
                        token,
                        store: defStore,

                    })*/
                } else {
                    reject('Email / Password does not match')
                }
            } else {
                reject('User not found')
            }
        })
    }

    @Query(() => Administrator)
    async GetAdministratorData(
        @Context() context
    ): Promise<Administrator> {
        return new Promise(async (resolve, reject) => {
            const auth = context.req.headers.authorization;
            if (auth) {
                const token = auth.split(' ')[1];
                const admin: any = this.jwtService.decode(token)
                const master = await this.administratorService.getAdministratorById(admin.adminId)
                console.log(master)
                if (master) {
                    resolve(master)
                } else {
                    reject('Unauthorized!')
                }
            } else {
                reject('Unauthorized!')
            }
        })
    }

    @Query(() => [Administrator])
    async GetAllAdministrator(
        @Args({name: 'search', nullable: true}) search: string,
    ): Promise<Administrator[]> {
        return this.administratorService.getAllAdministrators(search)
    }

    @Mutation(() => Administrator)
    async createAdministrator(
        @Args('fname') fname: string,
        @Args('lname') lname: string,
        @Args('email') email: string,
        @Args('phone') phone: string,
        @Args('password') password: string,
        @Args({name: 'type', type: () => AdministratorEnum}) type: AdministratorEnum,
        @Context() context
    ): Promise<Administrator> {
        return new Promise(async (resolve, reject) => {
            const auth = context.req.headers.authorization;
            const token = auth.split(' ')[1];
            const admin: any = this.jwtService.decode(token)
            const user = await User.findOne({where: {id: admin.userId}, relations: ["administrator"]})
            if (user) {
                if (user.administrator !== null) {
                    this.administratorService.createAdministrator(fname, lname, email, type, phone, password)
                        .then(value => {
                            console.log(value)
                            resolve(value)
                        })
                        .catch(error => {
                            console.log(error)
                            reject(error)
                        })
                } else {
                    reject('Unauthorized')
                }
            }
        })
    }

    @Mutation(() => User)
    async updateAdministratorPassword(
        @Args('email') email: string,
        @Args('password') password: string,
        @Args('newpassword') newpassword: string,
        @Context() context
    ): Promise<User> {
        return new Promise(async (resolve, reject) =>  {
            const auth = context.req.headers.authorization;
            const token = auth.split(' ')[1];
            const admin: any = this.jwtService.decode(token)
            const user = await User.findOne({where: {id: admin.userId}, relations: ["administrator"]})
            if (user) {
                if (user.administrator !== null) {
                    this.administratorService.updateAdministratorPassword(email, password, newpassword)
                        .then(value => resolve(value))
                        .catch(error => reject(error))
                }
            } else {
                reject('Unauthorized')
            }
        })
    }
}
