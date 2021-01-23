import { VendorPlans } from '@gridiron/entities';
import {Injectable} from '@nestjs/common';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection} from 'typeorm';

@Injectable()
export class VendorPlanService {
    constructor(
        @InjectConnection() private connection: Connection,
    ) {}

    async findAll(): Promise<VendorPlans[]> {
        return await this.connection.getRepository(VendorPlans).find()
    }

    async getVendorPlansForRegistration(): Promise<VendorPlans[]> {
        return this.connection.getRepository(VendorPlans).find({where:{isActive: true}})
    }
}
