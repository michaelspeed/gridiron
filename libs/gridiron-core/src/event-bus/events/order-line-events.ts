import { OrderLine, OrderStageType, User } from "@gridiron/entities";
import {GridIronEvents} from "../";

export class OrderLineEvents extends GridIronEvents {
    constructor(
        public orderLine: OrderLine,
        public type: OrderStageType
    ) {
        super();
    }
}

export class OrderLineProcessedEvent extends GridIronEvents {
    constructor(
        public order: OrderLine,
        public user: User
    ) {
        super();
    }
}
