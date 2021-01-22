import {OrderStageType} from "../../enums";
import {WorkerMessage} from "../../worker";

export interface ProcessOrderLineResponse {
    lineId: string,
    type: OrderStageType
}

export class OrderLineMessages extends WorkerMessage<{lineId: string, type: OrderStageType},ProcessOrderLineResponse> {
    static readonly pattern = 'ApplyOrderLine'
}

export type OrderLineJobData = {lineId: string, type: OrderStageType}
