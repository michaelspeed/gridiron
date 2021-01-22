import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Between, Connection} from "typeorm";
import {Administrator, Delivery, DeliveryPool, DeliverySignIn, DeliveryStranded, User} from "../../../entity";
import moment from "moment";

@Injectable()
export class DeliveryService {
    constructor(
        @InjectConnection() private connection: Connection
    ) {}

    async GetPoolStrength(): Promise<DeliveryPool[]> {
        return new Promise(async (resolve, reject) => {
            const pools = await this.connection.getRepository(DeliveryPool)
                .find({
                    where:{
                        createdAt: Between(moment().startOf("day").toDate(), moment().endOf("day").toDate())
                    },
                    relations: ['lines']
                })
            resolve(pools)
        })
    }

    async GetStrandedDelivery(): Promise<{count: number}> {
        return new Promise(async (resolve, reject) => {
            const stranded = await this.connection.getRepository(DeliveryStranded).count()
            resolve({
                count: stranded
            })
        })
    }

    async SetNewDeliveryGuy(userId: string, adminId: string): Promise<Delivery> {
        return new Promise(async (resolve, reject) => {
            const user = await this.connection.getRepository(Administrator).findOne({where:{user:{id: adminId}}})
            if (user) {
                const deliv = new Delivery()
                deliv.user = await this.connection.getRepository(User).findOne({where:{id: userId}})
                this.connection.getRepository(Delivery).save(deliv)
                    .then(value => {
                        resolve(value)
                    })
                    .catch(error => {
                        reject(error)
                    })
            } else {
                reject('Unauthorized!')
            }
        })
    }

    async SetDeliveryActive(userId: string, type: boolean): Promise<DeliverySignIn> {
        return new Promise(async (resolve, reject) => {
            const user = await this.connection.getRepository(User).findOne({where:{id: userId}, relations: ['delivery']})
            const deliverySignIn = new DeliverySignIn()
            deliverySignIn.online = type
            const deliveryPool = new DeliveryPool()
            const savedPool = await this.connection.getRepository(DeliveryPool).save(deliveryPool)
            deliverySignIn.pool = savedPool
            this.connection.getRepository(DeliverySignIn).save(deliverySignIn)
                .then(value => {
                    resolve(value)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
}
