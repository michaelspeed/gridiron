import {Injectable} from '@nestjs/common';
import {Administrator, User} from '../../../entity';
import {JwtService} from '@nestjs/jwt';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection, Like} from 'typeorm';
import {AdministratorEnum} from '../../../enums';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdministratorService {

    constructor(
        private readonly jwtService: JwtService,
        @InjectConnection() private readonly connection: Connection
    ) {
    }

    async createAdministrator(fname: string, lname: string, email: string, type: AdministratorEnum, number: string, password: string): Promise<Administrator> {
        return new Promise(async (resolve, reject) => {
            const finduser = await this.connection.getRepository(User).findOne({where:{email}})
            if (!finduser) {
                const user = new User()
                user.firstName = fname
                user.lastName = lname
                user.email = email
                user.phoneNumber = number
                user.password = await bcrypt.hash(password, 10)
                this.connection.getRepository(User).save(user).then(value => {
                    const admin = new Administrator()
                    admin.firstName = fname
                    admin.lastName = lname
                    admin.emailAddress = email
                    admin.type = type
                    admin.user = value
                    this.connection.getRepository(Administrator).save(admin)
                        .then(value1 => {
                            resolve(value1)
                        })
                        .catch(error => reject(error))
                })
            } else {
                const admin = new Administrator()
                admin.firstName = fname
                admin.lastName = lname
                admin.emailAddress = email
                admin.type = type
                admin.user = finduser
                this.connection.getRepository(Administrator).save(admin)
                    .then(value => {
                        resolve(value)
                    }).catch(error => reject(error))
            }
        })
    }

    async updateAdministratorPassword(email: string, password: string, newpassword: string): Promise<User> {
        return new Promise(async (resolve, reject) => {
            const user = await this.connection.getRepository(User).findOne({where:{email: email}})
            const valid = await bcrypt.compare(password, user.password)
            if (valid) {
                user.password = await bcrypt.hash(newpassword, 10)
                this.connection.getRepository(User).save(user).then(value => {
                    resolve(value)
                })
            } else {
                reject('Password does not match')
            }
        })
    }

    async getAllAdministrators(name?: string): Promise<Administrator[]> {
        return this.connection.getRepository(Administrator).find({
            /*where: [
                {
                    firstName: Like(`%${name !== undefined && name} %`)
                },
                {
                    lastName: Like(`%${name !== undefined && name} %`)
                }
            ]*/
            relations: ['user']
        })
    }

    createToken(userId: string, adminId: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            const tokenize = {userId, adminId}
            const token = await this.jwtService.sign(tokenize)
            resolve(token)
        })
    }

    getAdministratorById(id: string): Promise<Administrator> {
        return Administrator.findOne({where:{id}})
    }
}
