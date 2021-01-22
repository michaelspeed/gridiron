import {Injectable} from '@nestjs/common';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection} from 'typeorm';
import {
    Accounts,
    AuthenticatedSession,
    Store, StoreBalance,
    StoreTypeEnum,
    User,
    Vendor,
    VendorLicense,
    VendorPlans,
    Zone
} from '../../../entity';
import uniqid from 'uniqid';
import {VendorPlanPrice, VendorPlanTenure} from '@gridiron/core/enums/VendorPlan';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {SessionService} from '../global/session.service';
import {EventBus, VendorEvents} from '../../../event-bus';
import moment from 'moment';

@Injectable()
export class VendorService {
    constructor(
       @InjectConnection() private connection: Connection,
       private readonly jwtService: JwtService,
       private readonly sessionService: SessionService,
       private eventBus: EventBus,
    ) {}

    async findOneVendor(userId: string): Promise<Vendor> {
        return new Promise(async (resolve, reject) => {
            const vendor = await this.connection.getRepository(Vendor).findOne({where:{user:{id: userId}}, relations: ['store']})
            if (vendor) {
                resolve(vendor)
            } else {
                resolve(null)
            }

        })
    }

    createVendorToken(userId: string, vendorId: string, sessionId: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            const tokenize = {userId, vendorId, sessionId}
            const token = await this.jwtService.sign(tokenize)
            resolve(token)
        })
    }

    onLoginVendor(email: string, password: string): Promise<{vendor: Vendor, user: User, session: AuthenticatedSession}> {
        return new Promise<{vendor: Vendor, user: User, session: AuthenticatedSession}>(async (resolve, reject) => {
            const user = await this.connection.getRepository(User).findOne({where:{email}, relations: ['vendor']})
            if (user) {
                if (user.vendor) {
                    const valid = await bcrypt.compare(password, user.password)
                    if (valid) {
                        const tokensession = await this.sessionService.CreateAuthenticatedSession(user as any)
                        resolve({
                            user: user,
                            vendor: user.vendor,
                            session: tokensession
                        })
                    }
                } else {
                    reject('You are not authorized to enter here')
                }
            } else {
                reject('User Not found')
            }
        })
    }

    createVendor(
        name: string,
        email: string,
        phone: string
    ): Promise<Vendor> {
        return new Promise<Vendor>(async (resolve, reject) => {
            const vendor = new Vendor()
            vendor.email = email
            vendor.vendorName = name
            vendor.phoneNumber = phone
            let user = await this.connection.getRepository(User).findOne({where: {email}})
            if (user) {
                vendor.user = user
            } else {
                const newUser = new User()
                newUser.email = email
                newUser.password = uniqid('password-')
                newUser.firstName = name
                user = await this.connection.getRepository(User).save(newUser)
            }
            vendor.user = user
            this.connection.getRepository(Vendor).save(vendor)
                .then(value => {
                    resolve(value)
                }).catch(error => reject(error))
        })
    }

    registerVendor(
        email: string,
        fname: string,
        lname: string,
        phone: string,
        password: string,
        storeName: string,
        storeNumber: string,
        officialEmail: string,
        region: string,
        zipcode: string,
        streetAddress1: string,
        streetAddress2: string,
        rentals: boolean,
        planID: string
    ): Promise<{vendor: Vendor, user: User, session: AuthenticatedSession}> {
        return new Promise(async (resolve, reject) => {
            const vendor = new Vendor()
            vendor.email = email
            vendor.vendorName = `${fname} ${lname}`
            vendor.phoneNumber = phone
            let finduser = await this.connection.getRepository(User).findOne({where:{email}})
            if (finduser) {
                vendor.user = finduser
            } else {
                const user = new User()
                user.email = email
                user.firstName = fname
                user.lastName = lname
                user.phoneNumber = phone
                user.password = await bcrypt.hash(password, 10)
                finduser = await this.connection.getRepository(User).save(user)
                vendor.user = finduser
            }
            const store = new Store()
            store.storeName = storeName
            store.phoneNumber = storeNumber
            store.officialemail = officialEmail
            store.region = await this.connection.getRepository(Zone).findOne({where:{id: region}})
            store.zipcode = zipcode
            store.streetAddress1 = streetAddress1
            store.streetAddress2 = streetAddress2
            store.rentalStore = rentals
            store.type = StoreTypeEnum.VENDOR

            const balance = new StoreBalance()
            const savedBalance = await this.connection.getRepository(StoreBalance).save(balance)
            store.balance = savedBalance

            vendor.store = await this.connection.getRepository(Store).save(store)

            const account = new Accounts()
            const savedAccount = await this.connection.getRepository(Accounts).save(account)
            vendor.account = savedAccount

            const vendorLicense = new VendorLicense()
            const plan = await this.connection.getRepository(VendorPlans).findOne({where:{id: planID}})
            vendorLicense.plans = plan
            vendorLicense.tenureStart = new Date()
            if (plan.tenureStrategy === VendorPlanTenure.MONTHLY) {
                vendorLicense.tenureEnd = moment().add('1', 'month').toDate()
            } else if (plan.tenureStrategy === VendorPlanTenure.HALFYEARLY) {
                vendorLicense.tenureEnd = moment().add('6', 'months').toDate()
            } else if (plan.tenureStrategy === VendorPlanTenure.ANNUAL) {
                vendorLicense.tenureEnd = moment().add('1', 'year').toDate()
            }
            vendor.license = await this.connection.getRepository(VendorLicense).save(vendorLicense)
            const vendorsave = await this.connection.getRepository(Vendor).save(vendor)
            const authSession = await this.sessionService.CreateAuthenticatedSession(finduser)
            this.eventBus.publish(new VendorEvents(vendorsave, 'created'))
            resolve({
                vendor: vendorsave,
                user: finduser,
                session: authSession
            })
        })
    }

    createVendorPlans(
        name: string,
        value: number,
        priceStrategy: VendorPlanPrice,
        tenureStrategy: VendorPlanTenure
    ): Promise<VendorPlans> {
        return new Promise<VendorPlans>(async (resolve, reject) => {
            const plan = new VendorPlans()
            plan.name = name
            plan.planValue = value
            plan.priceStrategy = priceStrategy
            plan.tenureStrategy = tenureStrategy
            this.connection.getRepository(VendorPlans)
                .save(plan)
                .then(value1 => {
                    resolve(value1)
                }).catch(error => reject(error))
        })
    }

    updatePlan(
        id: string,
        status: boolean
    ): Promise<VendorPlans> {
        return new Promise<VendorPlans>(async (resolve, reject) => {
            const plan = await this.connection.getRepository(VendorPlans).findOne(id)
            if (!plan) {
                reject({message: 'Plan not found'})
            }
            plan.isActive = status
            this.connection.getRepository(VendorPlans).save(plan).then(value => {
                resolve(plan)
            })
        })
    }
}
