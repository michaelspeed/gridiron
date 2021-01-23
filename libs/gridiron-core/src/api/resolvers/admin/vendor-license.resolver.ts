import {Resolver} from '@nestjs/graphql';
import {VendorLicense, VendorPlans} from '../../../entity';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';

@Resolver(of => VendorLicense)
export class VendorLicenseResolver extends CRUDResolver(VendorLicense, {
    create: {
        disabled: true
    },
    update: {
        disabled: true
    },
    delete: {
        disabled: true
    },
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(VendorLicense) readonly service: QueryService<VendorLicense>
    ) {
        super(service);
    }
}
