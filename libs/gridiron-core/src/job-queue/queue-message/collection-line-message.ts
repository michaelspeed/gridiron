import {WorkerMessage} from "../../worker";

export interface CollectionLineResponse {
    total: number,
    completed: number,
    collectionId: string,
    vendorId: string
}

export class CollectionLineMessage extends WorkerMessage<{collectionId: string, vendorId: string[]}, CollectionLineResponse> {
    static readonly pattern = 'ApplyCollectionChanges'
}

export type CollectionLineJobData = {collectionId: string}
