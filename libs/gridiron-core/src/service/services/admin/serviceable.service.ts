import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {Serviceable, Vendor, Product} from "../../../entity";

@Injectable()
export class ServiceableService {
    constructor(
        @InjectConnection() private connection: Connection
    ) {}

    async addServiceableToVendor(service: string, vendor:string): Promise<Serviceable> {
        const fvendor = await this.connection.getRepository(Vendor).findOne(vendor)
        const fservice = await this.connection.getRepository(Serviceable).findOne(service)
        if (fservice.vendors === undefined) {
            fservice.vendors = [fvendor]
        } else {
            fservice.vendors.push(fvendor)
        }
        return this.connection.getRepository(Serviceable).save(fservice)
    }

    async addServiceableToProduct(service: string, product: string): Promise<Serviceable> {
        const fprod = await this.connection.getRepository(Product).findOne(product)
        const fservice = await this.connection.getRepository(Serviceable).findOne(service)
        if (fservice.product === undefined) {
            fservice.product = [fprod]
        } else {
            fservice.product.push(fprod)
        }
        return this.connection.getRepository(Serviceable).save(fservice)
    }

    async removeServiceableToProduct(product: string): Promise<Product> {
        const prod = await this.connection.getRepository(Product).findOne(product)
        prod.serviceable = null
        return this.connection.getRepository(Product).save(prod)
    }

    async removeServiceableToVendor(vendor: string): Promise<Vendor> {
        const ven = await this.connection.getRepository(Vendor).findOne(vendor)
        ven.serviceable = null
        return this.connection.getRepository(Vendor).save(ven)
    }
}
