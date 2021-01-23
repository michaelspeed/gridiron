import {WorkerMessage} from "../../worker";

export interface VendorLineResponse {
    total: number,
    completed: number,
    collectionId: string,
    vendorId: string
}

export class VendorLineMessage extends WorkerMessage<{vendorId: string, collectionIds: string[]}, VendorLineResponse> {
    static readonly pattern = 'create-vendor-billing-agreement'
}

export type VendorLineJobData = {vendorId: string}
