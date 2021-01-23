import {Injectable} from '@nestjs/common';

@Injectable()
export class ProcessContext {
    protected _isServer: boolean

    get isServer(): boolean {
        return this._isServer
    }
    get isWorker(): boolean {
        return !this._isServer
    }
}

@Injectable()
export class ServerProcessContext extends ProcessContext {
    protected _isServer = true
}

@Injectable()
export class WorkerProcessContext extends ProcessContext {
    protected _isServer = false
}
