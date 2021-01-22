import {GridIronEvents} from "../";
import {OrderLine, User} from "../../entity";
import {OrderStageType} from "../../enums/OrderStageType";

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
