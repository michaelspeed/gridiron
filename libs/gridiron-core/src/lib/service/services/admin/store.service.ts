import {Injectable} from '@nestjs/common';
import {Country, Store, StoreTypeEnum} from '../../../entity';

@Injectable()
export class StoreService {

    async GetDefaultStore(): Promise<Store> {
        return  Store.findOne({where:{type: StoreTypeEnum.DEFAULT}})
    }

    async CreateDefaultStore(
        storeName: string,
        phoneNumber: string,
        officialemail: string,
        GSTIN: string,
        streetAddress1: string,
        streetAddress2: string,
        zipcode: string,
        countryId: string
    ): Promise<Store> {
        return new Promise(async (resolve, reject) => {
            const country = await Country.findOne({where: {id: countryId}})
            const store = new Store()
            store.storeName = storeName
            store.phoneNumber = phoneNumber
            store.officialemail = officialemail
            store.type = StoreTypeEnum.DEFAULT
            store.GSTIN = GSTIN
            store.streetAddress1 = streetAddress1
            store.streetAddress2 = streetAddress2
            store.zipcode = zipcode
            store.country = country!
            store.services = true
            store.save().then(value => {
                resolve(value)
            }).catch(error => reject(error))
        })
    }
}
