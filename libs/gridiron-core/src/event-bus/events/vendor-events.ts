import {GridIronEvents} from '../gridIron-events';
import {Vendor} from '../../entity';

export class VendorEvents extends GridIronEvents {
    constructor(
        public vendor: Vendor,
        public type: 'created' | 'updated' | 'deleted',
    ) {
        super();
    }
}
