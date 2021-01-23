import {GridIronEvents} from "..";
import {Collection} from "../../entity";

export class CollectionEvents extends GridIronEvents {
    constructor(
        public collection: Collection,
        public type: 'created'
    ) {
        super();
    }
}
