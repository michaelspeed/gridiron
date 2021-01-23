import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {Accounts, User, Vendor} from "../../../entity";

@Injectable()
export class AccountsService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectConnection() private readonly connection: Connection
    ) {}

    async GetAccountInfo(userId: string): Promise<Accounts> {
        return new Promise(async (resolve, reject) => {
            const user = await this.connection.getRepository(User).findOne({where:{id: userId}, relations: ['vendor', 'vendor.account']})
            console.log(user)
            if (user.vendor) {
                if (user.vendor.account === null) {
                    const account = new Accounts()
                    account.vendor = await this.connection.getRepository(Vendor).findOne({where:{id: user.vendor.id}})
                    this.connection.getRepository(Accounts).save(account)
                        .then(value => {
                            console.log(value)
                            resolve(value)
                        }).catch(error => {
                            console.log(error)
                            reject(error)
                    })
                } else {
                    resolve(user.vendor.account)
                }

            } else {
                reject('Non Vendor Account')
            }
        })
    }
}
