import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {ResetCode, User} from "../../../entity";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import uniqid from 'uniqid'

@Injectable()
export class ShopUserService {
    constructor(
        @InjectConnection() private connection: Connection,
        private readonly jwtService: JwtService
    ) {}

    private async DecryptToken(token: string): Promise<{userId: string}> {
        return new Promise(async (resolve, reject) => {
            const decoded: any = await this.jwtService.decode(token)
            resolve(decoded)
        })
    }

    private async createToken(userId: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const tokenize = {userId}
            const token = await this.jwtService.sign(tokenize)
            resolve(token)
        })
    }

    async CreateUser(email: string, password: string, phone: string, fname: string, lname: string): Promise<{user: User, token: string}> {
        return new Promise(async (resolve, reject) => {
            const user = new User()
            user.email = email
            user.password = await bcrypt.hash(password, 10)
            user.phoneNumber = phone
            user.firstName = fname
            user.lastName = lname
            user.lastLogin = new Date()
            this.connection.getRepository(User)
                .save(user).then(async (value) => {
                    const token = await this.createToken(value.id)
                    resolve({
                        user,
                        token
                    })
            }).catch(error => reject(error))
        })
    }

    async LoginUser(email: string, password: string): Promise<{user: User, token: string}> {
        return new Promise(async (resolve, reject) => {
            const user = await this.connection.getRepository(User).findOne({
                where: [
                    {email: email},
                    {phoneNumber: email}
                ]
            })
            if (!user) {
                reject('User not found')
            }
            const valid = await bcrypt.compare(password, user.password)
            if (valid) {
                const token = await this.createToken(user.id)
                resolve({
                    user,
                    token
                })
            } else {
                reject('Incorrect Password')
            }
        })
    }

    async getUserId(token: string): Promise<User> {
        const decoded = await this.DecryptToken(token)
        return this.connection.getRepository(User).findOne({where:{id: decoded.userId}, relations: ['cart', 'address']})
    }

    async updateAccountInfo(firstname: string, lastname: string, phone: string, token: string): Promise<User> {
        return new Promise(async (resolve, reject) => {
            const decoded = await this.DecryptToken(token)
            const user = await this.connection.getRepository(User).findOne({where:{id: decoded.userId}})
            user.firstName = firstname
            user.lastName = lastname
            user.phoneNumber = phone
            this.connection.getRepository(User).save(user)
                .then(value => resolve(value)).catch(error => reject(error))
        })
    }

    async resetPassword(email: string): Promise<ResetCode> {
        return new Promise<ResetCode>(async (resolve, reject) => {
            const user = await this.connection.getRepository(User).findOne({where:{email:email}})
            const resetcode = new ResetCode()
            resetcode.user = user
            resetcode.code = uniqid('reset-')
            this.connection.getRepository(ResetCode).save(resetcode)
                .then(value => resolve(value)).catch(e => reject(e))
        })
    }
}
