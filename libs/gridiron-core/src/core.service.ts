import {Injectable, OnModuleInit} from '@nestjs/common';
import {Administrator, Country, Role, Store, StoreBalance, User} from './entity';
import {CountryCode, Permission, RoleType} from './enums';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CoreService implements OnModuleInit {
    onModuleInit(): any {
        this.onMasterInit()
    }

    async onMasterInit() {
        // await this.startStoreBalance()
        await this.startInitialSetup()
        await this.startCountryData()
        await this.startRolesData()
    }

    async startInitialSetup(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const alladministratos = await Administrator.count()
            if (alladministratos === 0) {
                const initUser = new User()
                initUser.firstName = "a"
                initUser.lastName = "b"
                initUser.email = "generated@gridiron.com"
                initUser.password = await bcrypt.hash("generated", 10)
                initUser.phoneNumber = "0"
                initUser.save().then(async (value) => {
                    const admin = new Administrator()
                    admin.firstName = "a"
                    admin.lastName = "b"
                    admin.emailAddress = "generated@gridiron.com"
                    admin.user = value
                    admin.save().then(value1 => {
                        resolve()
                    })
                })
            } else {
                resolve()
            }
        })
    }

    async startCountryData(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const allCount = await Country.find()
            if (allCount.length === 0) {
                let total = CountryCode.length
                for (let country of CountryCode) {
                    const cont = new Country()
                    cont.name = country.name
                    cont.code = country.code
                    cont.enabled = true
                    await cont.save()
                    total = total - 1
                    if (total === 0) {
                        resolve()
                    }
                }
            } else {
                resolve()
            }
        })
    }

    async startRolesData(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const getAdmin = await Role.find({where:{type: RoleType.ADMINISTRATOR}})
            const getVendor = await Role.find({where:{type: RoleType.VENDOR}})
            const getUser = await Role.find({where:{type: RoleType.USER}})
            if (getAdmin.length === 0) {
                const role = new Role()
                role.type = RoleType.ADMINISTRATOR
                role.permissions = Object.values(Permission)
                role.code = 'Administrator Role'
                role.description = 'Administrator Role'
                await role.save()
            }
            if(getVendor.length === 0) {
                const role = new Role()
                role.type = RoleType.VENDOR
                role.permissions = Object.values(Permission)
                role.code = 'Vendor Role'
                role.description = 'Vendor Role'
                await role.save()
            }
            if(getUser.length === 0) {
                const role = new Role()
                role.type = RoleType.USER
                role.permissions = Object.values(Permission)
                role.code = 'User Role'
                role.description = 'User Role'
                await role.save()
            }
        })
    }

    async startStoreBalance(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const allStore = await Store.find({relations: ['balance']})
            console.log(allStore)
            for (let store of allStore) {
                if (!store.balance) {
                    const bal = new StoreBalance()
                    bal.balance = 0
                    bal.store = store
                    await bal.save()
                }
            }
            resolve()
        })
    }
}
