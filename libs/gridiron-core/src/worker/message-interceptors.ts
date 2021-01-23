import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {WorkerMonitor} from './worker-monitor';

@Injectable()
export class MessageInterceptors implements NestInterceptor {
    constructor(private monitor: WorkerMonitor) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        this.monitor.increment();
        return next
            .handle()
            .pipe(
                finalize(() => {
                    this.monitor.decrement()
                })
            )
    }

}
