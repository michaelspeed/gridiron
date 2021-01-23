import { Collection } from "@gridiron/entities";
import {GridIronEvents} from "..";

export class CollectionEvents extends GridIronEvents {
    constructor(
        public collection: Collection,
        public type: 'created'
    ) {
        super();
    }
}
