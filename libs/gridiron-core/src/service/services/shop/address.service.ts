import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {Address, User} from "../../../entity";
import {JwtService} from "@nestjs/jwt";
import {AddressType} from "../../../enums/AddressType";

@Injectable()
export class ShopAddressService {
    constructor(
        @InjectConnection() private connection: Connection,
        private readonly jwtService: JwtService
    ) {}

    async DecryptToken(token: string): Promise<{userId: string}> {
        return new Promise(async (resolve, reject) => {
            const decoded: any = await this.jwtService.decode(token)
            resolve(decoded)
        })
    }

    async getAllUserAddress(token: string): Promise<Address[]> {
        const decoded = await this.DecryptToken(token)
        return this.connection.getRepository(Address).find({where:{user:{id: decoded.userId}}})
    }

    async createNewAddress(
        fullname: string,
        addressLine: string,
        city: string,
        state: string,
        landmark: string,
        postalCode: string,
        phone: string,
        type: AddressType,
        token: string
    ): Promise<Address> {
        return new Promise(async (resolve, reject) => {
            const decoded = await this.DecryptToken(token)
            const user = await this.connection.getRepository(User).findOne({where: {id: decoded.userId}})
            const address = new Address()
            address.fullName = fullname
            address.addressLine = addressLine
            address.city = city
            address.state = state
            address.landmark = landmark
            address.postalCode = postalCode
            address.phoneNumber = phone
            address.addressType = type
            address.user = user
            this.connection.getRepository(Address)
                .save(address)
                .then(value => resolve(value))
                .catch(error => reject(error))
        })
    }

    async updateNewAddress(
        fullname: string,
        addressLine: string,
        city: string,
        state: string,
        landmark: string,
        postalCode: string,
        phone: string,
        type: AddressType,
        token: string,
        id: string
    ): Promise<Address> {
        return new Promise(async (resolve, reject) => {
            const decoded = await this.DecryptToken(token)
            const user = await this.connection.getRepository(User).findOne({where: {id: decoded.userId}})
            if (user) {
                const address = await this.connection.getRepository(Address).findOne({where:{id}})
                address.fullName = fullname
                address.addressLine = addressLine
                address.city = city
                address.state = state
                address.landmark = landmark
                address.postalCode = postalCode
                address.phoneNumber = phone
                address.addressType = type
                this.connection.getRepository(Address)
                    .save(address)
                    .then(value => resolve(value))
                    .catch(error => reject(error))
            } else {
                reject('Unauthorized')
            }
        })
    }
}
