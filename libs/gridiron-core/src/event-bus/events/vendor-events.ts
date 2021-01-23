import { Vendor } from '@gridiron/entities';
import {GridIronEvents} from '../gridIron-events';

export class VendorEvents extends GridIronEvents {
    constructor(
        public vendor: Vendor,
        public type: 'created' | 'updated' | 'deleted',
    ) {
        super();
    }
}
