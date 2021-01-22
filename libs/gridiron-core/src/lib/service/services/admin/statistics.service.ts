import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Between, Connection} from "typeorm";
import {OrderLine, Product, View} from "../../../entity";
import moment, {unitOfTime} from "moment";

@Injectable()
export class StatisticsService {
    constructor(
        @InjectConnection() readonly connection: Connection
    ) {}

    async getProductStatistics(productId: string, type: string = 'MONTH', store?: string) {
        return new Promise<any>(async (resolve, reject) => {
            const prod = await this.connection.getRepository(Product).findOne({where:{id: productId}, relations: ['variants']})
            const vards = prod.variants.map(item => item.id)
            let breaks = 1
            let adder: unitOfTime.DurationConstructor = 'day'
            if (type === 'YEAR') {
                breaks = 12
                adder = 'month'
            }
            const labelBuffers = []
            const datasource = []
            if (breaks === 1) {
                const now = moment()
                let subDate = moment(moment().subtract(1, "month").toDate())
                console.log(now.toDate(), subDate.toDate())
                const midData = await this.connection.getRepository(OrderLine)
                    .createQueryBuilder('orderLine')
                    .innerJoinAndSelect('orderLine.item', 'item')
                    .innerJoinAndSelect('item.productVariant', 'productVariant')

                midData.where('productVariant.id IN (:...vart)', {vart: vards})
                if (store) {
                    midData.innerJoinAndSelect('orderLine.store', 'store')
                    midData.andWhere('store.id = :store', {store: store})
                }
                midData.andWhere('orderLine.createdAt BETWEEN DATE(:sdate) AND DATE(:edate)', {sdate: subDate.toDate(), edate: now.toDate()})

            const getData = await midData.getMany()

                    /*.find({where: {createdAt: Between(subDate.startOf('day').toDate(), now.toDate())}, relations: ['item']})*/
                while (now.toDate() >= subDate.toDate()) {
                    labelBuffers.push(subDate.format('DD MMM YYYY'))
                    let sum = 0
                    let amountCount = 0
                    for (const items of getData) {
                        if (moment(items.createdAt).isSame(subDate, adder)) {
                            sum = sum + 1
                            const price: any = items.priceField
                            amountCount = (price.price * items.item.quantity) + amountCount
                        }
                    }
                    datasource.push({
                        sum,
                        amount: amountCount
                    })
                    subDate = subDate.add(1, adder)
                }
                resolve({
                    labels: labelBuffers,
                    datasource: datasource
                })
            } else {
                const now = moment()
                let subDate = moment(moment().subtract(1, "year").toDate())
                console.log(now.toDate(), subDate.toDate())
                const midData = await this.connection.getRepository(OrderLine)
                    .createQueryBuilder('orderLine')
                    .innerJoinAndSelect('orderLine.item', 'item')
                    .innerJoinAndSelect('item.productVariant', 'productVariant')


                midData.where('productVariant.id IN (:...vart)', {vart: vards})
                if (store) {
                    midData.innerJoinAndSelect('orderLine.store', 'store')
                    midData.andWhere('store.id = :store', {store: store})
                }
                midData.andWhere('orderLine.createdAt BETWEEN DATE(:sdate) AND DATE(:edate)', {sdate: subDate.toDate(), edate: now.toDate()})

                const getData = await midData.getMany()
                while (now.toDate() >= subDate.toDate()) {
                    labelBuffers.push(subDate.format('MMM'))
                    let sum = 0
                    let amountCount = 0
                    for (const items of getData) {
                        if (moment(items.createdAt).isSame(subDate, adder)) {
                            sum = sum + 1
                            const price: any = items.priceField
                            amountCount = (price.price * items.item.quantity) + amountCount
                        }
                    }
                    datasource.push({
                        sum,
                        amount: amountCount
                    })
                    subDate = subDate.add(1, adder)
                }
                resolve({
                    labels: labelBuffers,
                    datasource: datasource
                })
            }
        })
    }

    async getProductViews(productId: string, type: string = 'MONTH') {
        return new Promise<any>(async (resolve, reject) => {
            switch (type) {
                case 'MONTH': {
                    const adder = 'day'
                    const now = moment()
                    const ldate = moment().subtract(1, "month")
                    let sdate = ldate
                    const views = await this.connection.getRepository(View).find({
                        where: {
                            product:{
                                id: productId
                            },
                            createdAt:Between(ldate.toDate(), now.toDate())
                        }
                    })
                    const labelbuffers = []
                    const datasource = []
                    while (now.toDate() >= sdate.toDate()) {
                        labelbuffers.push(sdate.format('DD MMM YYYY'))
                        let sum = 0
                        for (const vi of views) {
                            if (moment(vi.createdAt).isSame(sdate, adder)) {
                                sum = ++sum
                            }
                        }
                        datasource.push({
                            sum: sum
                        })
                        sdate = sdate.add(1, adder)
                    }
                    resolve({
                        labels: labelbuffers,
                        datasource: datasource
                    })
                }
                break;
                case 'YEAR': {
                    const adder = 'month'
                    const now = moment()
                    const ldate = moment().subtract(1, "year")
                    let sdate = ldate
                    const views = await this.connection.getRepository(View).find({
                        where: {
                            product:{
                                id: productId
                            },
                            createdAt:Between(ldate.toDate(), now.toDate())
                        }
                    })
                    const labelbuffers = []
                    const datasource = []
                    while (now.toDate() >= sdate.toDate()) {
                        labelbuffers.push(sdate.format('MMM'))
                        let sum = 0
                        for (const vi of views) {
                            if (moment(vi.createdAt).isSame(sdate, adder)) {
                                sum = ++sum
                            }
                        }
                        datasource.push({
                            sum: sum
                        })
                        sdate = sdate.add(1, adder)
                    }
                    resolve({
                        labels: labelbuffers,
                        datasource: datasource
                    })
                }
                break;
                default: {
                    const adder = 'day'
                    const now = moment()
                    const ldate = moment().subtract(1, "month")
                    let sdate = ldate
                    const views = await this.connection.getRepository(View).find({
                        where: {
                            product:{
                                id: productId
                            },
                            createdAt:Between(ldate.toDate(), now.toDate())
                        }
                    })
                    const labelbuffers = []
                    const datasource = []
                    while (now.toDate() >= sdate.toDate()) {
                        labelbuffers.push(sdate.format('DD MMM YYYY'))
                        let sum = 0
                        for (const vi of views) {
                            if (moment(vi.createdAt).isSame(sdate, adder)) {
                                sum = ++sum
                            }
                        }
                        datasource.push({
                            sum: sum
                        })
                        sdate = sdate.add(1, adder)
                    }
                    resolve({
                        labels: labelbuffers,
                        datasource: datasource
                    })
                }
            }
        })
    }


    async getAdminViews(type: string = 'MONTH') {
        return new Promise<any>(async (resolve, reject) => {
            switch (type) {
                case 'MONTH': {
                    const adder = 'day'
                    const now = moment()
                    const ldate = moment().subtract(1, "month")
                    let sdate = ldate
                    const views = await this.connection.getRepository(View).find({
                        where: {
                            createdAt:Between(ldate.toDate(), now.toDate())
                        }
                    })
                    const labelbuffers = []
                    const datasource = []
                    while (now.toDate() >= sdate.toDate()) {
                        labelbuffers.push(sdate.format('DD MMM YYYY'))
                        let sum = 0
                        for (const vi of views) {
                            if (moment(vi.createdAt).isSame(sdate, adder)) {
                                sum = ++sum
                            }
                        }
                        datasource.push({
                            sum: sum
                        })
                        sdate = sdate.add(1, adder)
                    }
                    resolve({
                        labels: labelbuffers,
                        datasource: datasource
                    })
                }
                break;
                case 'YEAR': {
                    const adder = 'month'
                    const now = moment()
                    const ldate = moment().subtract(1, "year")
                    let sdate = ldate
                    const views = await this.connection.getRepository(View).find({
                        where: {
                            createdAt:Between(ldate.toDate(), now.toDate())
                        }
                    })
                    const labelbuffers = []
                    const datasource = []
                    while (now.toDate() >= sdate.toDate()) {
                        labelbuffers.push(sdate.format('MMM'))
                        let sum = 0
                        for (const vi of views) {
                            if (moment(vi.createdAt).isSame(sdate, adder)) {
                                sum = ++sum
                            }
                        }
                        datasource.push({
                            sum: sum
                        })
                        sdate = sdate.add(1, adder)
                    }
                    resolve({
                        labels: labelbuffers,
                        datasource: datasource
                    })
                }
                break;
                default: {
                    const adder = 'day'
                    const now = moment()
                    const ldate = moment().subtract(1, "month")
                    let sdate = ldate
                    const views = await this.connection.getRepository(View).find({
                        where: {
                            createdAt:Between(ldate.toDate(), now.toDate())
                        }
                    })
                    const labelbuffers = []
                    const datasource = []
                    while (now.toDate() >= sdate.toDate()) {
                        labelbuffers.push(sdate.format('DD MMM YYYY'))
                        let sum = 0
                        for (const vi of views) {
                            if (moment(vi.createdAt).isSame(sdate, adder)) {
                                sum = ++sum
                            }
                        }
                        datasource.push({
                            sum: sum
                        })
                        sdate = sdate.add(1, adder)
                    }
                    resolve({
                        labels: labelbuffers,
                        datasource: datasource
                    })
                }
            }
        })
    }

    async getStoreOrderStatistics(storeId: string, type: string = 'MONTH') {
        return new Promise<any>(async (resolve, reject) => {
            switch (type) {
                case 'MONTH': {
                    const adder = 'day'
                    const now = moment()
                    const ldate = moment().subtract(1, 'month')
                    let sdate = ldate
                    const orderLine = await this.connection.getRepository(OrderLine).find({
                        where:{
                            store:{
                                id: storeId
                            },
                            createdAt: Between(ldate.toDate(), now.toDate())
                        },
                        relations: ['item']
                    })
                    const labelbuffers = []
                    const datasource = []
                    while (now.toDate() >= sdate.toDate()) {
                        labelbuffers.push(sdate.format('DD MMM YYYY'))
                        let sum = 0
                        let amountCount = 0
                        for (const item of orderLine) {
                            if (moment(item.createdAt).isSame(sdate, adder)) {
                                sum = ++sum
                                const price: any = item.priceField
                                amountCount = (price.price * item.item.quantity) + amountCount
                            }
                        }
                        datasource.push({
                            sum,
                            amount: amountCount
                        })
                        sdate = sdate.add(1, adder)
                    }
                    resolve({
                        labels: labelbuffers,
                        datasource: datasource
                    })
                }
                break;
                case 'YEAR': {
                    const adder = 'month'
                    const now = moment()
                    const ldate = moment().subtract(1, 'year')
                    let sdate = ldate
                    const orderLine = await this.connection.getRepository(OrderLine).find({
                        where:{
                            store:{
                                id: storeId
                            },
                            createdAt: Between(ldate.toDate(), now.toDate())
                        },
                        relations: ['item']
                    })
                    const labelbuffers = []
                    const datasource = []
                    while (now.toDate() >= sdate.toDate()) {
                        labelbuffers.push(sdate.format('DD MMM YYYY'))
                        let sum = 0
                        let amountCount = 0
                        for (const item of orderLine) {
                            if (moment(item.createdAt).isSame(sdate, adder)) {
                                sum = ++sum
                                const price: any = item.priceField
                                amountCount = (price.price * item.item.quantity) + amountCount
                            }
                        }
                        datasource.push({
                            sum,
                            amount: amountCount
                        })
                        sdate = sdate.add(1, adder)
                    }
                    resolve({
                        labels: labelbuffers,
                        datasource: datasource
                    })
                }
                break;
                default : {
                    const adder = 'day'
                    const now = moment()
                    const ldate = moment().subtract(1, 'month')
                    let sdate = ldate
                    const orderLine = await this.connection.getRepository(OrderLine).find({
                        where:{
                            store:{
                                id: storeId
                            },
                            createdAt: Between(ldate.toDate(), now.toDate())
                        },
                        relations: ['item']
                    })
                    const labelbuffers = []
                    const datasource = []
                    while (now.toDate() >= sdate.toDate()) {
                        labelbuffers.push(sdate.format('DD MMM YYYY'))
                        let sum = 0
                        let amountCount = 0
                        for (const item of orderLine) {
                            if (moment(item.createdAt).isSame(sdate, adder)) {
                                sum = ++sum
                                const price: any = item.priceField
                                amountCount = (price.price * item.item.quantity) + amountCount
                            }
                        }
                        datasource.push({
                            sum,
                            amount: amountCount
                        })
                        sdate = sdate.add(1, adder)
                    }
                    resolve({
                        labels: labelbuffers,
                        datasource: datasource
                    })
                }
                break
            }
        })
    }

    async getAdminOrderStatistics(type: string = 'MONTH') {
        return new Promise<any>(async (resolve, reject) => {
            switch (type) {
                case 'MONTH': {
                    const adder = 'day'
                    const now = moment()
                    const ldate = moment().subtract(1, 'month')
                    let sdate = ldate
                    const orderLine = await this.connection.getRepository(OrderLine).find({
                        where:{
                            createdAt: Between(ldate.toDate(), now.toDate())
                        },
                        relations: ['item']
                    })
                    const labelbuffers = []
                    const datasource = []
                    while (now.toDate() >= sdate.toDate()) {
                        labelbuffers.push(sdate.format('DD MMM YYYY'))
                        let sum = 0
                        let amountCount = 0
                        for (const item of orderLine) {
                            if (moment(item.createdAt).isSame(sdate, adder)) {
                                sum = ++sum
                                const price: any = item.priceField
                                amountCount = (price.price * item.item.quantity) + amountCount
                            }
                        }
                        datasource.push({
                            sum,
                            amount: amountCount
                        })
                        sdate = sdate.add(1, adder)
                    }
                    resolve({
                        labels: labelbuffers,
                        datasource: datasource
                    })
                }
                break;
                case 'YEAR': {
                    const adder = 'month'
                    const now = moment()
                    const ldate = moment().subtract(1, 'year')
                    let sdate = ldate
                    const orderLine = await this.connection.getRepository(OrderLine).find({
                        where:{
                            createdAt: Between(ldate.toDate(), now.toDate())
                        },
                        relations: ['item']
                    })
                    const labelbuffers = []
                    const datasource = []
                    while (now.toDate() >= sdate.toDate()) {
                        labelbuffers.push(sdate.format('DD MMM YYYY'))
                        let sum = 0
                        let amountCount = 0
                        for (const item of orderLine) {
                            if (moment(item.createdAt).isSame(sdate, adder)) {
                                sum = ++sum
                                const price: any = item.priceField
                                amountCount = (price.price * item.item.quantity) + amountCount
                            }
                        }
                        datasource.push({
                            sum,
                            amount: amountCount
                        })
                        sdate = sdate.add(1, adder)
                    }
                    resolve({
                        labels: labelbuffers,
                        datasource: datasource
                    })
                }
                break;
                default : {
                    const adder = 'day'
                    const now = moment()
                    const ldate = moment().subtract(1, 'month')
                    let sdate = ldate
                    const orderLine = await this.connection.getRepository(OrderLine).find({
                        where:{
                            createdAt: Between(ldate.toDate(), now.toDate())
                        },
                        relations: ['item']
                    })
                    const labelbuffers = []
                    const datasource = []
                    while (now.toDate() >= sdate.toDate()) {
                        labelbuffers.push(sdate.format('DD MMM YYYY'))
                        let sum = 0
                        let amountCount = 0
                        for (const item of orderLine) {
                            if (moment(item.createdAt).isSame(sdate, adder)) {
                                sum = ++sum
                                const price: any = item.priceField
                                amountCount = (price.price * item.item.quantity) + amountCount
                            }
                        }
                        datasource.push({
                            sum,
                            amount: amountCount
                        })
                        sdate = sdate.add(1, adder)
                    }
                    resolve({
                        labels: labelbuffers,
                        datasource: datasource
                    })
                }
                break
            }
        })
    }
}
