import {Inject, Injectable, OnModuleDestroy} from '@nestjs/common';
import {BehaviorSubject, Observable} from 'rxjs';
import {ClientProxy} from '@nestjs/microservices';
import {filter, finalize, mergeMap, take} from 'rxjs/operators';
import {WorkerMessage} from './types';
import {GRIDIRON_WORKER_CLIENT} from './constants';

@Injectable()
export class WorkerService implements OnModuleDestroy {
    private pendingConnection = false
    private initialConnection = new BehaviorSubject(false)

    constructor(@Inject(GRIDIRON_WORKER_CLIENT) private readonly client: ClientProxy) {}

    send<T, R>(message: WorkerMessage<T, R>): Observable<R> {
        if (!this.pendingConnection && this.initialConnection.value === false) {
            this.pendingConnection = true
            return this.client
                .send<R, T>((message.constructor as typeof WorkerMessage).pattern, message.data)
                .pipe(
                    finalize(() => {
                        this.initialConnection.next(true)
                        this.pendingConnection = false
                    })
                )
        } else {
            return this.initialConnection.pipe(
                filter(value => value),
                take(1),
                mergeMap(() => {
                    return this.client.send<R, T>(
                        (message.constructor as typeof WorkerMessage).pattern,
                        message.data
                    )
                })
            )
        }
    }

    onModuleDestroy(): any {
        this.client.close()
    }
}
